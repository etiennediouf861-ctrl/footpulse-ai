import React, { useState } from 'react';
import { FootballMatch } from '../types/football';
import { apiUrl } from '../utils/api';
import { Bot, Send, User, Sparkles, AlertCircle } from 'lucide-react';

interface AiChatAnalystProps {
  match: FootballMatch;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiChatAnalyst: React.FC<AiChatAnalystProps> = ({ match }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Bonjour ! Je suis **Coach Vision AI**, votre analyste tactique pour la rencontre **${match.homeTeam.name} vs ${match.awayTeam.name}**.
Score actuel : **${match.score.home} - ${match.score.away}** (${match.minute}'). Posez-moi vos questions sur les ajustements tactiques, les xG ou l'issue probable du match !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickQuestions = [
    `Quelle équipe est la plus proche du prochain but ?`,
    `Le score (${match.score.home}-${match.score.away}) reflète-t-il les xG ?`,
    `Quels ajustements pour le coach de ${match.homeTeam.shortName} ?`,
    `Qui est le joueur le plus décisif sur le terrain ?`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl('/api/analyst-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          match: {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            score: match.score,
            minute: match.minute,
            status: match.status,
            stats: match.stats,
            events: match.events,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setError(data.error || "Impossible d'obtenir une réponse de l'analyste.");
      }
    } catch (err: any) {
      setError(err?.message || "Erreur de connexion avec l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0e1526] p-5 shadow-xl flex flex-col h-[580px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Analyste Tactique Vidéo & Données</h3>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interrogez l&apos;IA sur la dynamique en cours du match
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                  isAi
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  isAi
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`mt-1 text-[9px] ${
                    isAi ? 'text-slate-500' : 'text-emerald-200 text-right'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 w-fit">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
            <span>L&apos;analyste dissèque les statistiques en direct...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="rounded-lg bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-800 transition truncate max-w-[260px]"
              title={q}
            >
              💬 {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question tactique sur le match..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
