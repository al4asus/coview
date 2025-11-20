import React from 'react';
import { Mic, VideoOff, LogOut } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';

const RoomPage = ({ roomId, onLeave }) => {
  // Kopyalama butonu için basit fonksiyon
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Oda ID'si kopyalandı!");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-white p-4 lg:p-6">
      <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-6">
        
        {/* SOL TARAFA: Video ve Kontroller */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Üst Başlık ve Ayrıl Butonu */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                📁 Çalışma Grubu 
                <button 
                  onClick={copyRoomId}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800 border border-slate-700 font-mono hover:bg-slate-700 transition-colors"
                  title="Kopyalamak için tıkla"
                >
                  ID: {roomId}
                </button>
              </h2>
            </div>
            <button onClick={onLeave} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
              <LogOut size={18} /> Ayrıl
            </button>
          </div>
          
          {/* VİDEO OYNATICI (roomId gönderiyoruz ki senkronizasyon yapsın) */}
          <VideoPlayer roomId={roomId} />
          
          {/* Katılımcılar Listesi (Şimdilik Görsel) */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((user) => (
              <div key={user} className="flex items-center gap-3 bg-slate-900 p-2 pr-4 rounded-full border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">U{user}</div>
                <div className="flex gap-2"><Mic size={14} className="text-slate-400" /><VideoOff size={14} className="text-red-400" /></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* SAĞ TARAFA: Sohbet Kutusu (roomId gönderiyoruz) */}
        <div className="w-full lg:w-96 h-[500px] lg:h-auto shrink-0">
          <Chat roomId={roomId} />
        </div>

      </div>
    </div>
  );
};

export default RoomPage;