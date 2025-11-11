import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Quiz } from '../../../Back-end/models/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/quizzes';

  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  quizzes$ = this.quizzesSubject.asObservable();

  constructor() {
    this.loadQuizzes();
  }

  private loadQuizzes(): void {
    this.http.get<Quiz[]>(this.apiUrl).pipe(
      tap(quizzes => {
        console.log('[QuizService] Quizzes cargados desde servidor:', quizzes);
        this.quizzesSubject.next(quizzes);
      }),
      catchError(err => {
        console.warn('[QuizService] Servidor no disponible, usando datos de demostración:', err.message);
        // Cargar quizzes de demostración si el servidor no responde
        const demoQuizzes: Quiz[] = [
          {
            id: 1,
            title: 'Quiz de Ejemplo',
            course: 'Demo',
            description: 'Este es un quiz de demostración',
            questions: [
              {
                text: '¿Cuál es la capital de Francia?',
                options: [
                  { text: 'Madrid', isCorrect: false },
                  { text: 'París', isCorrect: true },
                  { text: 'Londres', isCorrect: false }
                ]
              }
            ]
          }
        ];
        this.quizzesSubject.next(demoQuizzes);
        return of([]);
      })
    ).subscribe();
  }

  getQuizzes(): Quiz[] {
    return this.quizzesSubject.value.slice();
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }

  getQuizzesByCourse(courseId: string): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}?courseId=${courseId}`);
  }

  addQuiz(quiz: Omit<Quiz, 'id'>): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz).pipe(
      tap(newQuiz => {
        const updated = [...this.quizzesSubject.value, newQuiz];
        this.quizzesSubject.next(updated);
        console.log('[QuizService] addQuiz:', newQuiz);
      })
    );
  }

  updateQuiz(id: number, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz).pipe(
      tap(updatedQuiz => {
        const list = this.quizzesSubject.value.map(q => 
          q.id === id ? updatedQuiz : q
        );
        this.quizzesSubject.next(list);
      })
    );
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const list = this.quizzesSubject.value.filter(q => q.id !== id);
        this.quizzesSubject.next(list);
      })
    );
  }

  setQuizzes(quizzes: Quiz[]): void {
    this.quizzesSubject.next(quizzes.slice());
  }
}
