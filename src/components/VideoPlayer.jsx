import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Link as LinkIcon, Upload, Loader2, FileVideo, AlertCircle, X, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- YARDIMCI FONKSİYON ---
const isYouTube = (checkUrl) => {
  if (!checkUrl) return false;
  const lowerUrl = checkUrl.toLowerCase().trim();
  return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
};

const VideoPlayer = ({ roomId }) => {
  // --- DURUMLAR ---
  const [url, setUrl] = useState(''); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Sadece dosya yüklerken true
  const [playerError, setPlayerError] = useState(null);
  
  // Oynatıcıyı yenilemek için anahtar
  const [playerKey, setPlayerKey] = useState(0);
  
  const playerRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- VİDEO GÜNCELLEME MANTIĞI ---
  const handleIncomingVideo = (newUrl) => {
    console.log("YENİ VİDEO GELDİ:", newUrl);
    setPlayerError(null);
    setUrl(newUrl);
    // Oynatıcıyı sıfırla (Remount)
    setPlayerKey(prev => prev + 1);
  };

  // --- 1. ODAYI DİNLE (SYNC) ---
  useEffect(() => {
    if (!roomId) return;

    // A) Mevcut durumu çek
    const fetchRoomState = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('current_video_url, is_playing')
        .eq('id', roomId)
        .single();
      
      if (data) {
        if (data.current_video_url && data.current_video_url !== url) {
          handleIncomingVideo(data.current_video_url);
        }
        if (data.is_playing !== isPlaying) {
           setIsPlaying(data.is_playing);
        }
      }
    };
    fetchRoomState();

    // B) Canlı Dinle
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, (payload) => {
        const newData = payload.new;
        if (newData.current_video_url && newData.current_video_url !== url) {
           handleIncomingVideo(newData.current_video_url);
        }
        if (newData.is_playing !== isPlaying) {
           setIsPlaying(newData.is_playing);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]); 

  // --- 2. KULLANICI EYLEMLERİ ---
  const updateRoomVideo = async (newUrl) => {
    handleIncomingVideo(newUrl);
    setIsPlaying(true); 
    
    await supabase
      .from('rooms')
      .update({ current_video_url: newUrl, is_playing: true })
      .eq('id', roomId);
  };

  const togglePlayPause = async (playingState) => {
    setIsPlaying(playingState);
    await supabase.from('rooms').update({ is_playing: playingState }).eq('id', roomId);
  };

  // --- HANDLERS ---
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (inputUrl) {
      let cleanUrl = inputUrl.trim();
      if (isYouTube(cleanUrl) && cleanUrl.includes('&')) {
        cleanUrl = cleanUrl.split('&')[0];
      }
      updateRoomVideo(cleanUrl);
      setInputUrl('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Dosya 100 MB'dan büyük olamaz.");
      return;
    }

    setIsUploading(true);
    setPlayerError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `video_${Date.now()}.${fileExt}`;
      
      const { error: uploadErr } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { contentType: file.type });

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log("Dosya Linki Hazır:", data.publicUrl);
      await updateRoomVideo(data.publicUrl);

    } catch (error) {
      console.error("Yükleme Hatası:", error);
      alert('Hata: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- RENDER ---
  const isYoutubeVideo = isYouTube(url);

  return (
    <div className="flex flex-col gap-4">
      {/* KONTROL PANELİ */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <form onSubmit={handleUrlSubmit} className="flex-1 flex gap-2 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/50">
          <div className="flex items-center pl-2 text-slate-400"><LinkIcon size={16} /></div>
          <input 
            type="text" 
            placeholder="YouTube linki..." 
            className="flex-1 bg-transparent text-white text-sm outline-none min-w-[100px]"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md">AÇ</button>
        </form>

        <div className="flex items-center justify-center">
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg border transition-all ${isUploading ? 'bg-slate-800 text-slate-400' : 'bg-purple-600 text-white hover:bg-purple-700 border-purple-500'}`}
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {isUploading ? '...' : 'YÜKLE'}
          </button>
        </div>
      </div>

      {/* OYNATICI ALANI */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl ring-1 ring-white/10 flex items-center justify-center group">
        
        {/* HATA MESAJI */}
        {playerError && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center text-red-400 gap-2 p-4 text-center pointer-events-none">
            <AlertCircle size={40} />
            <p className="font-bold">Oynatılamadı</p>
            <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded break-all">{playerError}</p>
          </div>
        )}

        {/* YÜKLEME EKRANI (Sadece dosya sunucuya giderken görünür) */}
        {isUploading && (
          <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center text-white gap-3 backdrop-blur-sm">
             <button 
               onClick={() => setIsUploading(false)} 
               className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full z-50"
             >
               <X size={20} />
             </button>
            <Loader2 size={48} className="animate-spin text-purple-500" />
            <p className="font-medium animate-pulse">Video Sunucuya Yükleniyor...</p>
          </div>
        )}

        {/* OYNATICI SEÇİMİ */}
        {url ? (
          isYoutubeVideo ? (
            <ReactPlayer
              key={playerKey}
              ref={playerRef}
              url={url}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={true}
              onPlay={() => togglePlayPause(true)}
              onPause={() => togglePlayPause(false)}
              onError={(e) => {
                setPlayerError("YouTube videosu açılamadı.");
                console.error(e);
              }}
            />
          ) : (
            <video
              id="native-video-player"
              key={playerKey}
              src={url}
              className="w-full h-full object-contain"
              controls
              autoPlay={true}
              playsInline
              onPlay={() => togglePlayPause(true)}
              onPause={() => togglePlayPause(false)}
              onError={(e) => {
                console.error("Native Video Error:", e);
                setPlayerError("Video formatı desteklenmiyor.");
              }}
            />
          )
        ) : (
          <div className="flex flex-col items-center text-slate-600 gap-3">
             <div className="p-4 bg-slate-900/50 rounded-full"><FileVideo size={48} /></div>
             <p className="font-medium">Video Bekleniyor</p>
          </div>
        )}
      </div>
      
      {/* ALT BİLGİ */}
      <div className="flex justify-between items-center px-2 text-xs font-mono text-slate-500">
         <span className="truncate max-w-[60%]" title={url}>{url || "..."}</span>
         <span className={isPlaying ? "text-green-400" : "text-yellow-400"}>
           {isPlaying ? "OYNATILIYOR" : "DURAKLATILDI"}
         </span>
      </div>
    </div>
  );
};

export default VideoPlayer;