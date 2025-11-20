import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // --- DÜZELTİLEN KISIM ---
  // Math.random() işlemini bir fonksiyon içine aldık: () => ...
  // Böylece React bunu sadece sayfa ilk yüklendiğinde 1 kere çalıştırır.
  const [user] = useState(() => "Misafir " + Math.floor(Math.random() * 100));
  // ------------------------

  const messagesEndRef = useRef(null);

  // 1. Mesajları Yükle ve Canlı Dinle
  useEffect(() => {
    if (!roomId) return;

    // Önce mevcut mesajları çekelim
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      
      if (!error) setMessages(data || []);
    };

    fetchMessages();

    // Canlı dinlemeyi başlatalım (Realtime Subscription)
    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${roomId}` // Sadece bu odanın mesajlarını dinle
      }, (payload) => {
        // Yeni mesaj gelince listeye ekle
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    // Temizlik (Component kapanınca dinlemeyi durdur)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Otomatik aşağı kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Mesaj Gönderme
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textToSend = input;
    setInput(''); // Kutuyu hemen temizle

    // Veritabanına kaydet
    const { error } = await supabase
      .from('messages')
      .insert([
        { room_id: roomId, user_name: user, message: textToSend }
      ]);

    if (error) {
      console.error('Mesaj gitmedi:', error);
      alert('Mesaj gönderilemedi!');
    }
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
          <span className="text-blue-300 font-bold">{user}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10">
            Henüz mesaj yok. İlk yazan sen ol! 👋
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user_name === user ? 'items-end' : 'items-start'}`}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-bold ${msg.user_name === user ? 'text-blue-400' : 'text-purple-400'}`}>
                {msg.user_name}
              </span>
              <span className="text-[10px] text-slate-500">
                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[85%] break-words ${
              msg.user_name === user 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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

export default Chat;