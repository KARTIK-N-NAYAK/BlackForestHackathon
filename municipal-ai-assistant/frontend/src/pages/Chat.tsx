import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, AlertTriangle, Bot, User } from 'lucide-react';
import { sendChat } from '../api';
import CitationCard from '../components/CitationCard';
import type { ChatResponse } from '../api';

interface Message {
  role: 'user' | 'ai';
  text: string;
  response?: ChatResponse;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Guten Tag! Ich bin Ihr kommunaler KI-Assistent für Fragen zur Energiewende und Wärmeplanung. Stellen Sie mir eine Frage zu Ihren Dokumenten.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await sendChat(q);
      setMessages(prev => [...prev, { role: 'ai', text: res.answer, response: res }]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: 'Fehler bei der Verbindung zum Server. Bitte stellen Sie sicher, dass das Backend läuft.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-layout">
      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg ${msg.role === 'user' ? 'msg-user' : `msg-ai${msg.response?.is_uncertain ? ' msg-uncertain' : ''}`}`}>
            <div className={`msg-avatar ${msg.role === 'user' ? 'msg-avatar-user' : 'msg-avatar-ai'}`}>
              {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '72%' }}>
              <div className="msg-bubble">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Uncertain banner */}
              {msg.response?.is_uncertain && msg.response.clarification_request && (
                <div className="uncertain-banner">
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{msg.response.clarification_request}</span>
                </div>
              )}

              {/* Citations */}
              {msg.response?.citations && msg.response.citations.length > 0 && (
                <CitationCard citations={msg.response.citations} />
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="msg msg-ai">
            <div className="msg-avatar msg-avatar-ai">
              <Bot size={15} />
            </div>
            <div className="msg-bubble" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          rows={1}
          placeholder="Frage eingeben… (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send size={15} />
          Senden
        </button>
      </div>
    </div>
  );
}
