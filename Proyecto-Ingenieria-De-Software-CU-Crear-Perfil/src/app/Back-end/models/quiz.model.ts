export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  course?: string;
  description?: string;
  questions: QuizQuestion[];
}
