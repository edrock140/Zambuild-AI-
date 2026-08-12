import React, { useState } from "react";
import { Terminal, Send, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function DebugNetwork() {
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSubmitted(true);
    // In a real system, this would send to a server endpoint.
    setTimeout(() => {
      setSuggestion("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'1\'/%3E%3C/svg%3E')] bg-[#0A0A0A] p-6 md:p-10 text-[#E0E0E0] overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[#C67B58] text-xs font-mono uppercase tracking-[0.3em]">
            Debug Network
          </span>
          <div className="h-[1px] flex-1 bg-[#C67B58]/20"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-serif text-white mb-4 italic">
            System Upgrades & Diagnostics
          </h2>
          <p className="text-white/60 font-serif leading-relaxed">
            Access the Debug Network to securely transmit raw structural
            suggestions to the Mulembe Architecture development team. Propose
            path updates, architectural modifications, and cognitive framework
            expansions.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 shadow-xl relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C67B58] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C67B58]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#C67B58]">
              Live Connection
            </span>
          </div>

          <h3 className="text-sm uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <Terminal size={16} className="text-[#C67B58]" />
            Terminal Console
          </h3>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 border border-[#C67B58] text-[#C67B58] mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-[#C67B58] text-xs uppercase tracking-widest">
                Transmission Successful.
              </p>
              <p className="text-white/40 text-xs mt-2 font-mono">
                Packet verified and sent to Development Core.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">
                  Input Suggestion / Diagnostic
                </label>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-none px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-[#C67B58] transition-colors min-h-[150px] resize-none"
                  placeholder="> Initialize suggestion packet..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!suggestion.trim()}
                className="w-full p-4 bg-[#C67B58] hover:bg-white text-black font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                <Send size={14} />
                Transmit to Base
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
