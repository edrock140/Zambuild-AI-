import React, { useState, useEffect } from "react";
import { UserState } from "./types";
import { DigitalBook } from "./components/DigitalBook";
import { Assessment } from "./components/Assessment";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import { Portal } from "./components/Portal";
import { getUserFromDb, saveUserToDb } from "./lib/firebase";
import {
  Clock,
  BookOpen,
  BrainCircuit,
  LayoutDashboard,
  Network,
} from "lucide-react";

const SESSION_DURATION = 120 * 60; // 120 minutes in seconds

export default function App() {
  const [user, setUser] = useState<UserState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_DURATION);
  const [activeTab, setActiveTab] = useState<
    "book" | "assessment" | "dashboard" | "portal"
  >("dashboard");

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("zambuild_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const handleOnboardingComplete = async (newUser: UserState) => {
    setUser(newUser);
    localStorage.setItem("zambuild_user", JSON.stringify(newUser));
    // sync to db
    const existingUser = await getUserFromDb(newUser.digitalId);
    if (existingUser) {
      setUser(existingUser as UserState);
      localStorage.setItem("zambuild_user", JSON.stringify(existingUser));
    } else {
      await saveUserToDb(newUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("zambuild_user");
  };

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - user.startTime) / 1000);
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExpired = timeLeft === 0;

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-[#E0E0E0] font-sans">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 text-center shadow-xl relative z-10">
          <Clock className="w-16 h-16 text-[#C67B58] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-white mb-2 uppercase tracking-widest italic">
            Session Expired
          </h2>
          <p className="text-white/60 mb-6 text-sm leading-relaxed">
            Your 120-minute allocation for today's sovereign build session has
            concluded. Return tomorrow to continue your mastery.
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-transparent border border-[#C67B58] hover:bg-[#C67B58] hover:text-black text-[#C67B58] text-xs uppercase tracking-widest transition-colors"
          >
            End Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] font-sans text-[#E0E0E0] overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#C67B58] flex items-center justify-center font-serif text-lg font-bold text-black">
              M
            </div>
            <h1 className="text-lg font-serif tracking-widest text-[#C67B58] uppercase italic">
              ZamBuild AI
            </h1>
          </div>
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-none border border-white/10">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs uppercase tracking-wider font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#C67B58] text-black"
                  : "text-white/40 hover:text-[#C67B58]"
              }`}
            >
              <LayoutDashboard size={14} />
              Command Center
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs uppercase tracking-wider font-medium transition-colors ${
                activeTab === "book"
                  ? "bg-[#C67B58] text-black"
                  : "text-white/40 hover:text-[#C67B58]"
              }`}
            >
              <BookOpen size={14} />
              Book
            </button>
            <button
              onClick={() => setActiveTab("assessment")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs uppercase tracking-wider font-medium transition-colors ${
                activeTab === "assessment"
                  ? "bg-[#C67B58] text-black"
                  : "text-white/40 hover:text-[#C67B58]"
              }`}
            >
              <BrainCircuit size={14} />
              Assessment
            </button>
            <button
              onClick={() => setActiveTab("portal")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs uppercase tracking-wider font-medium transition-colors ${
                activeTab === "portal"
                  ? "bg-[#C67B58] text-black"
                  : "text-white/40 hover:text-[#C67B58]"
              }`}
            >
              <Network size={14} />
              Portal
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Digital Identity
            </span>
            <span className="text-sm font-mono text-white">
              @{user.digitalId} ({user.nickname})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] uppercase tracking-widest text-[#FF4444] hover:text-white transition-colors"
          >
            [Disconnect]
          </button>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center pr-4">
            <span className="text-[10px] uppercase tracking-widest text-[#C67B58]">
              Session
            </span>
            <span className="text-lg font-mono font-bold text-[#E0E0E0]">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "dashboard" && <Dashboard user={user} />}
          {activeTab === "book" && <DigitalBook language={user.language} />}
          {activeTab === "assessment" && <Assessment user={user} />}
          {activeTab === "portal" && <Portal />}
        </div>
      </div>
    </div>
  );
}
