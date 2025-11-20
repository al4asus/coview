import React, { useState } from 'react';

// Tüm parçaları birleştiriyoruz
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import RoomPage from './pages/Room';

function App() {
  const [view, setView] = useState('home');
  const [activeRoomId, setActiveRoomId] = useState(null);

  const handleJoinRoom = (id) => {
    setActiveRoomId(id);
    setView('room');
  };

  const handleLeaveRoom = () => {
    setActiveRoomId(null);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      <Navbar onNavigate={(v) => setView(v)} />
      
      <main>
        {view === 'home' ? (
          <HomePage onJoinRoom={handleJoinRoom} />
        ) : (
          <RoomPage roomId={activeRoomId} onLeave={handleLeaveRoom} />
        )}
      </main>
    </div>
  );
}

export default App;