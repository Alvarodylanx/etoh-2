import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../api';

const WELCOME = "Mbolo! I am your ETOH Market Guide. Ask me about products, local prices in CFA, recipes, safe trading tips, or delivery spots across Cameroon!";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await chatWithAI(text);
      setMessages((m) => [...m, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-header-avatar">🤖</span>
            <div>
              <div className="chat-header-title">ETOH Market Guide</div>
              <div className="chat-header-sub">Powered by Gemini AI</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-bubble ai loading">Thinking...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask about products, prices, recipes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
            />
            <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen((o) => !o)} title="Open AI Market Guide">
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
