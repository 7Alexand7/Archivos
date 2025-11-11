import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { Quiz } from '../../../Back-end/models/quiz.model';

@Component({
  selector: 'app-gestion-quizzes-estudiante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: '../html/gestion-quizzes-estudiante.html',
  styleUrls: ['../css/gestion-quizzes-estudiante.css'],
})
export class GestionQuizzesEstudiante implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  private sub: Subscription | null = null;
  cursoNombre: string = '';
  cursoCodigo: string = '';

  // UI state
  view: 'list' | 'take' | 'result' = 'list';
  selectedQuizIndex: number | null = null;
  // currentAnswers[qIndex] = selected option index
  currentAnswers: number[] = [];
  score: number | null = null;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener información del curso desde queryParams
    this.route.queryParams.subscribe(params => {
      this.cursoNombre = params['cursoNombre'] || '';
      this.cursoCodigo = params['cursoCodigo'] || '';
      console.log('[GestionQuizzesEstudiante] Curso:', this.cursoNombre, this.cursoCodigo);
      
      // Actualizar lista de quizzes cuando cambie el curso
      this.updateQuizList();
    });

    this.sub = this.quizService.quizzes$.subscribe(() => {
      // Actualizar cuando lleguen nuevos quizzes
      this.updateQuizList();
    });
  }

  private updateQuizList(): void {
    const allQuizzes = this.quizService.getQuizzes();
    // Filtrar quizzes solo del curso actual
    this.quizzes = allQuizzes.filter(q => q.course === this.cursoCodigo);
    console.log('[GestionQuizzesEstudiante] quizzes filtered for course', this.cursoCodigo, ':', this.quizzes.length);
    console.log('[GestionQuizzesEstudiante] All quizzes:', allQuizzes.map(q => ({ title: q.title, course: q.course })));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Selecciona un quiz para presentar
  openQuiz(index: number) {
    this.selectedQuizIndex = index;
    this.view = 'take';
    const qcount = this.quizzes[index].questions.length;
    this.currentAnswers = Array(qcount).fill(-1);
    this.score = null;
  }

  answerQuestion(qi: number, optionIdx: number) {
    this.currentAnswers[qi] = optionIdx;
  }

  submitQuiz() {
    if (this.selectedQuizIndex === null) return;
    const quiz = this.quizzes[this.selectedQuizIndex];
    let correct = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const chosen = this.currentAnswers[i];
      if (chosen >= 0 && quiz.questions[i].options[chosen]?.isCorrect) correct++;
    }
    this.score = correct;
    this.view = 'result';
  }

  backToList() {
    this.view = 'list';
    this.selectedQuizIndex = null;
    this.currentAnswers = [];
    this.score = null;
  }
}
