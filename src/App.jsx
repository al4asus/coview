import React, { useState } from 'react';
import { Play, Pause, Users, MessageSquare, Send, MonitorPlay, Link2, Mic, VideoOff, Settings, LogOut } from 'lucide-react';

// --- BİLEŞENLER ---

// 1. Navbar
const Navbar = ({ onNavigate }) => (
  <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 text-white">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <MonitorPlay size={20} className="text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight">CoView</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-sm text-slate-400 hidden sm:block">v1.0.0 (Beta)</div>
      <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
        <Settings size={20} className="text-slate-300" />
      </button>
    </div>
  </nav>
);

// 2. Video Player
const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Video Placeholder" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {!isPlaying && (
          <button 
            onClick={() => setIsPlaying(true)}
            className="absolute z-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border border-white/20"
          >
            <Play size={40} className="text-white fill-white ml-1" />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity opacity-100 group-hover:opacity-100">
        <div className="w-full h-1.5 bg-slate-700 rounded-full mb-4 cursor-pointer group/bar">
          <div 
            className="h-full bg-blue-500 rounded-full relative" 
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/bar:scale-100 transition-transform shadow-lg" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={24} className="fill-white" /> : <Play size={24} className="fill-white" />}
            </button>
            <span className="text-sm font-medium font-mono">05:42 / 14:20</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-2 py-1 bg-green-500/20 rounded text-xs font-medium text-green-400 border border-green-500/30">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               SYNCED
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Chat
const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Ahmet', text: 'Video başladı mı?', time: '14:01' },
    { id: 2, user: 'Ayşe', text: 'Evet, şu an 5. dakikadayım.', time: '14:02' },
    { id: 3, user: 'Mehmet', text: 'Senkronizasyon harika çalışıyor! 🚀', time: '14:02' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Sen', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-400" />
          Sohbet
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
          <Users size={12} />
          <span>4 Kişi</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === 'Sen' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-bold ${msg.user === 'Sen' ? 'text-blue-400' : 'text-purple-400'}`}>{msg.user}</span>
              <span className="text-[10px] text-slate-500">{msg.time}</span>
            </div>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
              msg.user === 'Sen' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 bg-slate-950 text-white text-sm rounded-lg border border-slate-800 px-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

// 4. Sayfalar
const HomePage = ({ onJoinRoom }) => (
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
              onClick={() => onJoinRoom('room-' + Math.floor(Math.random() * 1000))}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <MonitorPlay size={18} /> Oda Oluştur
            </button>
          </div>
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
            <h3 className="text-xl font-semibold">Odaya Katıl</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Oda Kodu" className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-white" />
              <button className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"><Link2 size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RoomPage = ({ roomId, onLeave }) => (
  <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-white p-4 lg:p-6">
    <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            📁 Çalışma Grubu <span className="px-2 py-0.5 rounded text-xs bg-slate-800 border border-slate-700 font-normal">ID: {roomId}</span>
          </h2>
          <button onClick={onLeave} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
            <LogOut size={18} /> Ayrıl
          </button>
        </div>
        <VideoPlayer />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((user) => (
            <div key={user} className="flex items-center gap-3 bg-slate-900 p-2 pr-4 rounded-full border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">U{user}</div>
              <div className="flex gap-2"><Mic size={14} className="text-slate-400" /><VideoOff size={14} className="text-red-400" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-96 h-[500px] lg:h-auto shrink-0"><Chat /></div>
    </div>
  </div>
);

// --- ANA UYGULAMA ---
function App() {
  const [view, setView] = useState('home');
  const [activeRoomId, setActiveRoomId] = useState(null);

  const handleJoinRoom = (id) => { setActiveRoomId(id); setView('room'); };
  const handleLeaveRoom = () => { setActiveRoomId(null); setView('home'); };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      <Navbar onNavigate={(v) => setView(v)} />
      <main>{view === 'home' ? <HomePage onJoinRoom={handleJoinRoom} /> : <RoomPage roomId={activeRoomId} onLeave={handleLeaveRoom} />}</main>
    </div>
  );
}

export default App;