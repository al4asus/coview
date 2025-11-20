import React, { useState } from 'react';
import { MonitorPlay, Link2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Bağlantı dosyamızı çağırıyoruz

const HomePage = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // --- GERÇEK ODA OLUŞTURMA FONKSİYONU ---
  const createRoom = async () => {
    setIsCreating(true);
    try {
      // 1. Veritabanına yeni bir oda ekle
      const { data, error } = await supabase
        .from('rooms') // 'rooms' tablosuna git
        .insert([
          { created_at: new Date() } // Yeni satır ekle
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Başarılıysa odaya giriş yap
      if (data) {
        console.log("Oda oluşturuldu:", data.id);
        onJoinRoom(data.id); // Artık ID veritabanından geliyor!
      }
    } catch (err) {
      console.error("Hata:", err.message);
      alert("Oda oluşturulurken hata çıktı! (Konsola bak)");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-950 text-white px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm font-medium border border-blue-800">
            🚀 Network Dersi Dönem Projesi
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Birlikte İzleyin,<br />Mesafeleri Yok Edin.
          </h1>
        </div>
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl mt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Yeni Oda</h3>
              <button 
                onClick={createRoom} // Fonksiyonu bağladık
                disabled={isCreating}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <MonitorPlay size={18} />}
                {isCreating ? 'Oluşturuluyor...' : 'Oda Oluştur'}
              </button>
            </div>
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
              <h3 className="text-xl font-semibold">Odaya Katıl</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Oda Kodu" 
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white" 
                />
                <button 
                  onClick={() => roomId && onJoinRoom(roomId)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                >
                  <Link2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;