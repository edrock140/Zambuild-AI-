export type Language =
  "English" | "Bemba" | "Silozi" | "Chewa" | "Tonga" | "Chinese";

export interface UserState {
  nickname: string;
  digitalId: string;
  language: Language;
  startTime: number;
  contactPartial?: string;
  email?: string;
  lastNicknameChange?: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}
