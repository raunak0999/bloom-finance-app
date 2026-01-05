import React, { useState } from 'react';
import axios from 'axios';
import './AIChatPage.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI financial advisor. I can help you with budgeting tips, savings strategies, and analyzing your spending patterns. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);



  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const payload: any = { message: input };
      if (userId) payload.userId = userId;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/ai/chat`,
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined
          }
        }
      );

      const aiMessage = { role: 'assistant', content: response.data.reply };
      setMessages(prev => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [
        ...prev,
        userMessage,
        { role: 'assistant', content: 'AI service is temporarily unavailable.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I reduce my expenses?",
    "What's a good savings rate?",
    "Should I create an emergency fund?",
    "How to budget for monthly expenses?"
  ];

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h1>🤖 AI Financial Advisor</h1>
        <p>Get personalized financial advice powered by AI</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role === 'assistant' ? 'ai' : 'user'}`}>
            <div className="message-avatar">
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="suggested-questions">
          <p>💡 Try asking:</p>
          <div className="questions-grid">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="suggested-btn"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about finances..."
          rows={1}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="send-btn"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default AIChatPage;
