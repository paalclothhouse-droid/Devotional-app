
export interface Hukamnama {
  text: string;
  translation: string;
  source: string;
  date: string;
}

export interface Katha {
  id: string;
  title: string;
  speaker: string;
  thumbnail: string;
  type: 'video' | 'audio';
  url: string;
  duration: string;
}

export interface UserStats {
  paathStreak: number;
  simranCount: number;
  lastUpdated: string;
}

export interface Scripture {
  id: string;
  title: string;
  pdfUrl: string;
  category: string;
}
