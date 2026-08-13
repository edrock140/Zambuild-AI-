import React, { useState } from "react";
import { ASSESSMENT_QUESTIONS } from "../data";
import { UserState } from "../types";
import { motion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { updateUserScore } from "../lib/firebase";

export function Assessment({ user }: { user?: UserState }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [chunkReviewing, setChunkReviewing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<
    "ai" | "traditional" | null
  >(null);

  const QUESTIONS_PER_PAGE = 10;
  const totalChunks = Math.ceil(
    ASSESSMENT_QUESTIONS.length / QUESTIONS_PER_PAGE,
  );

  const currentQuestions = ASSESSMENT_QUESTIONS.slice(
    currentChunk * QUESTIONS_PER_PAGE,
    (currentChunk + 1) * QUESTIONS_PER_PAGE,
  );

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted || chunkReviewing) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = ASSESSMENT_QUESTIONS.find((q) => q.id === qId);
    return acc + (q?.correctAnswer === answers[qId] ? 1 : 0);
  }, 0);

  const chunkAnswered = currentQuestions.every(
    (q) => answers[q.id] !== undefined,
  );
  const isComplete =
    Object.keys(answers).length === ASSESSMENT_QUESTIONS.length;

  const handleNextPhase = () => {
    if (!chunkReviewing) {
      setChunkReviewing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (currentChunk < totalChunks - 1) {
        setCurrentChunk((prev) => prev + 1);
        setChunkReviewing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitted(true);
        if (user) {
          // Calculate final score
          const finalScore = Object.keys(answers).reduce((acc, qId) => {
            const q = ASSESSMENT_QUESTIONS.find((q) => q.id === qId);
            return acc + (q?.correctAnswer === answers[qId] ? 1 : 0);
          }, 0);
          localStorage.setItem(
            `zambuild_score_${user.digitalId}`,
            finalScore.toString(),
          );
          
          const faction = finalScore > (ASSESSMENT_QUESTIONS.length / 2) 
            ? "AI Developers Network" 
            : "Raw Code Programmers";

          fetch("/api/assessment/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname: user.nickname, score: finalScore, faction })
          }).catch(err => console.error("Score submit error", err));
        }
        setChunkReviewing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'1\'/%3E%3C/svg%3E')] bg-[#0A0A0A] p-6 md:p-10 text-[#E0E0E0]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-[#C67B58] text-xs font-mono uppercase tracking-[0.3em]">
            Self-Assessment
          </span>
          <div className="h-[1px] flex-1 bg-[#C67B58]/20"></div>
        </div>
        <div className="mb-8">
          <h2 className="text-4xl font-serif text-white mb-4 italic">
            Raw Intelligence
          </h2>
          <p className="text-white/60 font-serif leading-relaxed">
            This is a self-assessment of your architectural mindset. You are
            evaluating yourself. AI cannot help you here; rely on your raw data.
            Upgrade your existing digital skills for the artificial generation.
            We scale up.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 p-10 text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#C67B58] text-[#C67B58] mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2 italic">
                Self-Assessment Complete
              </h3>
              <p className="text-white/60 mb-6 text-sm">
                Your raw intelligence score has been calculated.
              </p>
              <div className="text-6xl font-serif text-[#C67B58] mb-4">
                {score}{" "}
                <span className="text-2xl text-white/40">
                  / {ASSESSMENT_QUESTIONS.length}
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-[#C67B58]">
                {score >= 80
                  ? "Exceptional architectural thinking."
                  : "Continue noodling and tweaking."}
              </p>
            </div>

            <div className="space-y-6 mt-12">
              <h4 className="text-2xl font-serif text-[#C67B58] text-center italic mb-4">
                Connect with the Zambian Tech Ecosystem
              </h4>
              <p className="text-white/60 text-center text-sm mb-8 leading-relaxed">
                ZamBuild AI is only a bridge. We do not replace the community;
                we connect you to it. Register and network with existing Zambian
                developer organizations below to find jobs, mentorship, and
                real-world opportunities.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <a
                  href="https://bongohive.co.zm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 p-6 border border-white/10 hover:border-[#C67B58] hover:bg-[#C67B58]/5 transition-all group text-center"
                >
                  <h5 className="text-lg font-serif text-white group-hover:text-[#C67B58]">
                    BongoHive
                  </h5>
                  <p className="text-white/40 text-[10px] leading-relaxed flex-1">
                    Zambia's first technology and innovation hub. Great for
                    startups and networking.
                  </p>
                  <span className="flex items-center gap-2 mt-4 text-[#C67B58] text-[10px] uppercase tracking-widest border border-[#C67B58] px-3 py-1">
                    Register <ExternalLink size={12} />
                  </span>
                </a>

                <a
                  href="https://gdg.community.dev/gdg-lusaka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 p-6 border border-white/10 hover:border-[#C67B58] hover:bg-[#C67B58]/5 transition-all group text-center"
                >
                  <h5 className="text-lg font-serif text-white group-hover:text-[#C67B58]">
                    GDG Lusaka
                  </h5>
                  <p className="text-white/40 text-[10px] leading-relaxed flex-1">
                    Google Developer Groups. Deepen your technical skills and
                    meet local developers.
                  </p>
                  <span className="flex items-center gap-2 mt-4 text-[#C67B58] text-[10px] uppercase tracking-widest border border-[#C67B58] px-3 py-1">
                    Register <ExternalLink size={12} />
                  </span>
                </a>

                <a
                  href="https://asikananetwork.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 p-6 border border-white/10 hover:border-[#C67B58] hover:bg-[#C67B58]/5 transition-all group text-center"
                >
                  <h5 className="text-lg font-serif text-white group-hover:text-[#C67B58]">
                    Asikana Network
                  </h5>
                  <p className="text-white/40 text-[10px] leading-relaxed flex-1">
                    Empowering women in technology. Connecting female developers
                    in Zambia.
                  </p>
                  <span className="flex items-center gap-2 mt-4 text-[#C67B58] text-[10px] uppercase tracking-widest border border-[#C67B58] px-3 py-1">
                    Register <ExternalLink size={12} />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        ) : chunkReviewing ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#C67B58] mb-8">
              <span>Phase {currentChunk + 1} Review</span>
            </div>

            <div className="space-y-6">
              {currentQuestions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                const globalIndex =
                  currentChunk * QUESTIONS_PER_PAGE + index + 1;
                return (
                  <div
                    key={q.id}
                    className={`p-6 border ${isCorrect ? "border-[#C67B58]/30 bg-[#C67B58]/5" : "border-[#FF4444]/30 bg-[#FF4444]/5"}`}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">
                      Question {globalIndex}
                    </p>
                    <h3 className="text-lg font-serif italic text-white mb-4 leading-relaxed">
                      {q.text}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest">
                          Your Answer:
                        </span>
                        <span
                          className={
                            isCorrect ? "text-[#C67B58]" : "text-[#FF4444]"
                          }
                        >
                          {answers[q.id] !== undefined
                            ? q.options[answers[q.id]]
                            : "Not answered"}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="flex flex-col gap-1 mt-4">
                          <span className="text-white/40 text-[10px] uppercase tracking-widest">
                            Correct Source Answer:
                          </span>
                          <span className="text-white font-medium">
                            {q.options[q.correctAnswer]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNextPhase}
              className="w-full p-4 border border-[#C67B58] text-[#C67B58] hover:bg-[#C67B58] hover:text-black font-bold text-xs uppercase tracking-widest transition-colors"
            >
              {currentChunk < totalChunks - 1
                ? "Proceed to Next Phase"
                : "Finish Assessment"}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#C67B58]">
              <span>
                Phase {currentChunk + 1} of {totalChunks}
              </span>
              <span>
                {Math.round(
                  (Object.keys(answers).length / ASSESSMENT_QUESTIONS.length) *
                    100,
                )}
                % Complete
              </span>
            </div>
            <div className="relative h-1 w-full bg-white/5 mb-8">
              <div
                className="absolute h-full bg-[#C67B58] transition-all"
                style={{
                  width: `${(Object.keys(answers).length / ASSESSMENT_QUESTIONS.length) * 100}%`,
                }}
              ></div>
            </div>

            {currentQuestions.map((q, index) => {
              const globalIndex = currentChunk * QUESTIONS_PER_PAGE + index + 1;
              return (
                <div
                  key={q.id}
                  className="bg-white/[0.02] border border-white/10 p-6"
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">
                    Question {globalIndex}/{ASSESSMENT_QUESTIONS.length}
                  </p>
                  <h3 className="text-lg font-serif italic text-white mb-6 leading-relaxed">
                    {q.text}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left p-4 text-sm border transition-all ${
                          answers[q.id] === optIdx
                            ? "border-[#C67B58] bg-[#C67B58]/10 text-[#C67B58]"
                            : "border-white/10 text-white/60 hover:border-[#C67B58] hover:text-white"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="pt-6">
              {!chunkAnswered && (
                <p className="flex items-center justify-center gap-2 text-[#FF4444] text-[10px] uppercase tracking-widest mb-4">
                  <AlertCircle size={14} />
                  Please answer all questions in this phase to proceed.
                </p>
              )}
              <button
                onClick={handleNextPhase}
                disabled={!chunkAnswered}
                className="w-full p-4 border border-[#C67B58] text-[#C67B58] hover:bg-[#C67B58] hover:text-black font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentChunk < totalChunks - 1
                  ? "Ready to move to next phase?"
                  : "Submit Raw Intelligence Test"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
