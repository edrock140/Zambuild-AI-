import React, { useState, useEffect } from "react";
import { Chapter, Language } from "../types";
import { BOOK_CHAPTERS } from "../data";
import { motion } from "motion/react";
import { Book, ChevronRight, Loader2 } from "lucide-react";

interface Props {
  language: Language;
}

export function DigitalBook({ language }: Props) {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    BOOK_CHAPTERS[0].id,
  );
  const [translatedContent, setTranslatedContent] = useState<
    Record<string, { title: string; content: string }>
  >({});
  const [isTranslating, setIsTranslating] = useState(false);

  const activeChapter = BOOK_CHAPTERS.find((c) => c.id === activeChapterId)!;

  useEffect(() => {
    if (language === "English") return;

    const translateCurrentChapter = async () => {
      if (translatedContent[activeChapterId]) return;

      setIsTranslating(true);
      try {
        const [titleRes, contentRes] = await Promise.all([
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: activeChapter.title,
              targetLanguage: language,
            }),
          }).then((res) => res.json()),
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: activeChapter.content,
              targetLanguage: language,
            }),
          }).then((res) => res.json()),
        ]);

        setTranslatedContent((prev) => ({
          ...prev,
          [activeChapterId]: {
            title: titleRes.text || activeChapter.title,
            content: contentRes.text || activeChapter.content,
          },
        }));
      } catch (error) {
        console.error("Failed to translate:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    translateCurrentChapter();
  }, [activeChapterId, language]);

  const displayTitle =
    language === "English"
      ? activeChapter.title
      : translatedContent[activeChapterId]?.title || activeChapter.title;
  const displayContent =
    language === "English"
      ? activeChapter.content
      : translatedContent[activeChapterId]?.content || activeChapter.content;

  return (
    <div className="flex h-full bg-[#0A0A0A] text-[#E0E0E0] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto hidden md:flex">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] mb-6 text-white/30 font-bold">
            Chapters
          </p>
          <nav className="space-y-3">
            {BOOK_CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`w-full text-left px-3 py-2 border transition-colors text-xs uppercase tracking-wider ${
                  activeChapterId === chapter.id
                    ? "border-white/10 bg-[#C67B58] text-black font-bold"
                    : "border-white/5 text-white/40 hover:text-white"
                }`}
              >
                {language === "English"
                  ? chapter.title
                  : translatedContent[chapter.id]?.title || "Translating..."}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-8 bg-[#C67B58]/5 p-4 border-l-2 border-[#C67B58]">
          <p className="text-[10px] text-[#C67B58] uppercase font-bold mb-1">
            Local Context Aware
          </p>
          <p className="text-[11px] leading-relaxed italic text-white/60">
            Current Node: Lusaka District. For non-AI queries, refer to UNZA or
            local vocational centers.
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' fill=\'none\' stroke=\'rgba(255,255,255,0.02)\' stroke-width=\'1\'/%3E%3C/svg%3E')]">
        {isTranslating && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-[#C67B58] text-[10px] uppercase tracking-widest font-bold">
            <Loader2 size={12} className="animate-spin" />
            Translating to {language}...
          </div>
        )}
        <motion.div
          key={activeChapterId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto p-10"
        >
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-[#C67B58] text-xs font-mono uppercase tracking-[0.3em]">
              The Digital Codex {activeChapterId}
            </span>
            <div className="h-[1px] flex-1 bg-[#C67B58]/20"></div>
          </div>
          <h2 className="text-5xl font-serif mb-8 text-white leading-tight italic">
            {displayTitle}
          </h2>
          <article className="font-serif text-lg leading-relaxed space-y-6 text-white/80">
            {displayContent.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </article>
        </motion.div>
      </div>
    </div>
  );
}
