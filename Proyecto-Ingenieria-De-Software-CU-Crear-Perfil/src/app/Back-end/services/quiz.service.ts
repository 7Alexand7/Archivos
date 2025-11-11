import * as fs from 'fs';
import * as path from 'path';
import { Quiz } from '../models/quiz.model';

const QUIZZES_FILE = path.join(process.cwd(), 'src', 'app', 'Back-end', 'model', 'quizzes', 'control_data_quizzes', 'quizzes.json');

export class QuizService {
  private readQuizzes(): Quiz[] {
    try {
      const data = fs.readFileSync(QUIZZES_FILE, 'utf-8');
      return JSON.parse(data) as Quiz[];
    } catch (error) {
      return [];
    }
  }

  private writeQuizzes(quizzes: Quiz[]): void {
    fs.writeFileSync(QUIZZES_FILE, JSON.stringify(quizzes, null, 2), 'utf-8');
  }

  getAllQuizzes(): Quiz[] {
    return this.readQuizzes();
  }

  getQuizzesByCourse(courseId: string): Quiz[] {
    const quizzes = this.readQuizzes();
    return quizzes.filter(quiz => quiz.course === courseId);
  }

  getQuizById(id: number): Quiz | undefined {
    const quizzes = this.readQuizzes();
    return quizzes.find(quiz => quiz.id === id);
  }

  createQuiz(quiz: Omit<Quiz, 'id'>): Quiz {
    const quizzes = this.readQuizzes();
    const newId = quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1;
    const newQuiz: Quiz = { ...quiz, id: newId };
    quizzes.push(newQuiz);
    this.writeQuizzes(quizzes);
    return newQuiz;
  }

  updateQuiz(id: number, quiz: Partial<Quiz>): Quiz | null {
    const quizzes = this.readQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    
    if (index === -1) {
      return null;
    }

    quizzes[index] = { ...quizzes[index], ...quiz, id };
    this.writeQuizzes(quizzes);
    return quizzes[index];
  }

  deleteQuiz(id: number): boolean {
    const quizzes = this.readQuizzes();
    const filteredQuizzes = quizzes.filter(q => q.id !== id);
    
    if (filteredQuizzes.length === quizzes.length) {
      return false;
    }

    this.writeQuizzes(filteredQuizzes);
    return true;
  }
}
