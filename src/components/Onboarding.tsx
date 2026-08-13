import React, { useState } from "react";
import { UserState } from "../types";
import { Terminal, Shield, ArrowRight, Phone, KeyRound, Delete } from "lucide-react";

interface OnboardingProps {
  onComplete: (user: UserState) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<"nickname" | "phone" | "passcode" | null>(null);

  const handleKeyPress = (key: string) => {
    if (!activeField) return;

    if (key === "BACKSPACE") {
      if (activeField === "nickname") setNickname((prev) => prev.slice(0, -1));
      if (activeField === "phone") setPhone((prev) => prev.slice(0, -1));
      if (activeField === "passcode") setPasscode((prev) => prev.slice(0, -1));
      return;
    }

    if (activeField === "nickname") {
      setNickname((prev) => prev + (key === "SPACE" ? " " : key));
    } else if (activeField === "phone") {
      if (/[0-9]/.test(key) && phone.length < 9) {
        setPhone((prev) => prev + key);
      }
    } else if (activeField === "passcode") {
      if (/[a-z]/i.test(key) && passcode.length < 3) {
        setPasscode((prev) => prev + key.toLowerCase());
      }
    }
  };

  const renderKeyboard = () => {
    if (!activeField) return null;

    let rows = [];
    if (activeField === "phone") {
      rows = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["", "0", "BACKSPACE"],
      ];
    } else {
      rows = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m", "BACKSPACE"],
        ["SPACE"]
      ];
    }

    return (
      <div className="mt-8 p-4 bg-black/40 border border-white/10 rounded-sm">
        <div className="flex flex-col gap-2">
          {rows.map((row, i) => (
            <div key={i} className={`flex justify-center gap-1 ${row.length < 10 && activeField !== 'phone' ? 'px-4' : ''}`}>
              {row.map((key, j) => {
                if (key === "") return <div key={j} className="w-12 h-12" />; // Spacer for numpad
                const isAction = key === "BACKSPACE" || key === "SPACE";
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleKeyPress(key);
                    }}
                    className={`
                      ${activeField === 'phone' ? 'w-16 h-12 text-lg' : isAction ? 'px-4 h-10 text-xs' : 'w-8 h-10 text-sm'}
                      ${isAction && key === 'SPACE' ? 'flex-1 max-w-[200px]' : ''}
                      flex items-center justify-center
                      bg-white/5 border border-white/10 hover:bg-[#C67B58]/20 hover:text-[#C67B58] hover:border-[#C67B58]/50
                      transition-all uppercase font-mono rounded-sm text-white/80 active:scale-95
                    `}
                  >
                    {key === "BACKSPACE" ? <Delete size={16} /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !phone.trim() || !passcode.trim()) return;

    const cleanPhone = phone.replace(/\s+/g, "");
    if (!/^(95|96|97|76|77)\d{7}$/.test(cleanPhone)) {
      setError(
        "Please enter a valid 9-digit Zambian network number (e.g., 97XXXXXXX).",
      );
      setSuggestions([]);
      return;
    }

    if (!/^[a-z]{3}$/.test(passcode)) {
      setError(
        "Gatekeeper key must be exactly 3 lowercase letters (e.g. 'abc').",
      );
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError("");
    setSuggestions([]);

    const fullPhone = "+260" + cleanPhone;

    try {
      const res = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, passcode, nickname }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
        throw new Error(data.error || "Failed to authenticate.");
      }

      onComplete({
        nickname: data.nickname,
        digitalId: data.digitalId,
        language: "English",
        startTime: Date.now(),
        contactPartial: data.phone,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-[#E0E0E0] font-sans">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-10 shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-[#C67B58] flex items-center justify-center font-serif text-2xl font-bold text-black">
            M
          </div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-white uppercase tracking-widest italic mb-2">
            ZamBuild AI
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-wider">
            Authentication
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] text-xs text-center flex flex-col gap-3">
            <p>{error}</p>
            {suggestions.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Available Identifiers:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        setNickname(sug);
                        setError("");
                        setSuggestions([]);
                      }}
                      className="px-2 py-1 bg-black/40 border border-[#FF4444]/30 hover:bg-[#FF4444]/20 hover:text-white transition-colors text-[#E0E0E0]"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
              Nickname
            </label>
            <div className={`relative border transition-colors ${activeField === 'nickname' ? 'border-[#C67B58]' : 'border-white/10'}`}>
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onFocus={() => setActiveField('nickname')}
                inputMode="none"
                placeholder="e.g. Warmablon"
                className="w-full bg-black/50 p-3 pl-10 text-white placeholder-white/20 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
              Phone Number
            </label>
            <div className={`flex bg-black/50 border transition-colors relative ${activeField === 'phone' ? 'border-[#C67B58]' : 'border-white/10'}`}>
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <span className="py-3 pl-10 pr-3 text-white/60 border-r border-white/10 bg-white/5">
                +260
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                onFocus={() => setActiveField('phone')}
                inputMode="none"
                placeholder="97XXXXXXX"
                className="w-full bg-transparent p-3 text-white placeholder-white/20 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
              Access Key (3 Letters)
            </label>
            <div className={`relative border transition-colors ${activeField === 'passcode' ? 'border-[#C67B58]' : 'border-white/10'}`}>
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                maxLength={3}
                value={passcode}
                onChange={(e) =>
                  setPasscode(
                    e.target.value.toLowerCase().replace(/[^a-z]/g, ""),
                  )
                }
                onFocus={() => setActiveField('passcode')}
                inputMode="none"
                placeholder="abc"
                className="w-full bg-black/50 p-3 pl-10 text-white placeholder-white/20 focus:outline-none transition-colors text-center text-xl tracking-[1em]"
                required
              />
            </div>
            <p className="text-[10px] text-white/30 italic text-center mt-3 leading-relaxed">
              Choose your 3-letter signature for secure access.
            </p>
          </div>

          {renderKeyboard()}

          <button
            type="submit"
            disabled={loading || passcode.length !== 3}
            className="w-full mt-8 flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#C67B58] to-[#E89E7A] text-black hover:from-[#D98A66] hover:to-[#FBC3AA] shadow-[0_0_20px_rgba(198,123,88,0.3)] hover:shadow-[0_0_30px_rgba(198,123,88,0.5)] transition-all duration-300 uppercase tracking-widest text-xs font-bold disabled:opacity-50 disabled:shadow-none rounded-sm"
          >
            {loading ? "Authenticating..." : "Connect"}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
