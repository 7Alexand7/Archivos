import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';
import { Quiz, QuizQuestion, QuizOption } from '../../../Back-end/models/quiz.model';

@Component({
  selector: 'app-gestion-quizzes-profesor',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: '../html/gestion-quizzes-profesor.html',
  styleUrls: ['../css/gestion-quizzes-profesor.css'],
})
export class GestionQuizzesProfesor implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  private sub: Subscription | null = null;
  cursoNombre: string = '';
  cursoCodigo: string = '';

  showForm = false;
  // Contiene el arreglo de preguntas creadas
  form: {
    title: string;
    course: string;
    description: string;
    questions: Array<{ text: string; options: Array<{ text: string; isCorrect: boolean }> }>;
  } = { title: '', course: '', description: '', questions: [] };

  // Contiene la pregunta que se está creando actualmente
  currentQuestion: { text: string; options: Array<{ text: string; isCorrect: boolean }> } = {
    text: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  };

 

    constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {
    this.currentQuestion = { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] };
    this.form = { title: '', course: '', description: '', questions: [] };
  }

  ngOnInit(): void {
    // Obtener información del curso desde queryParams
    this.route.queryParams.subscribe(params => {
      this.cursoNombre = params['cursoNombre'] || '';
      this.cursoCodigo = params['cursoCodigo'] || '';
      this.form.course = this.cursoCodigo; // Asignar automáticamente el curso al formulario
      console.log('[GestionQuizzesProfesor] Curso:', this.cursoNombre, this.cursoCodigo);
    });

    this.sub = this.quizService.quizzes$.subscribe((qs: Quiz[]) => {
      // Filtrar quizzes solo del curso actual
      this.quizzes = qs.filter(q => q.course === this.cursoCodigo);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  statusMsg: string = '';
  statusType: 'success' | 'error' | '' = '';
  // índice de pregunta problemática en la lista (si hay validación fallida al guardar)
  problematicQuestionIndex: number | null = null;
  // límite máximo de preguntas por quiz
  readonly MAX_QUESTIONS = 12;
  // máximo de quizzes en la colección
  readonly MAX_QUIZZES = 10;
 //Una lista de metodos para gestionar el formulario de quizzes
  toggleForm() {
    if (this.quizzes.length >= this.MAX_QUIZZES) {
      this.statusMsg = `No puedes crear más de ${this.MAX_QUIZZES} quizzes.`;
      this.statusType = 'error';
      return;
    }
    this.statusMsg = '';
    this.statusType = '';
    this.showForm = !this.showForm;
  }

  addOptionToCurrentQuestion() {
    this.currentQuestion.options.push({ text: '', isCorrect: false });
  }

  setCorrectOption(idx: number) {
    this.currentQuestion.options = this.currentQuestion.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
  }

  removeOptionFromCurrentQuestion(idx: number) {
    if (this.currentQuestion.options.length <= 2) return;
    this.currentQuestion.options.splice(idx, 1);
  }

  addQuestionToForm() {
    this.statusMsg = '';
    this.problematicQuestionIndex = null;
    if (this.form.questions.length >= this.MAX_QUESTIONS) {
      this.statusMsg = `No puedes añadir más de ${this.MAX_QUESTIONS} preguntas por quiz.`;
      this.statusType = 'error';
      return;
    }
    const text = (this.currentQuestion.text || '').trim();
    if (!text) {
      this.statusMsg = 'La pregunta debe tener texto.';
      this.statusType = 'error';
      return;
    }
    const validOptions = this.currentQuestion.options.filter((o) => (o.text || '').trim() !== '');
    if (validOptions.length < 2) {
      this.statusMsg = 'Cada pregunta debe tener al menos 2 opciones con texto.';
      return;
    }
    const correctCount = validOptions.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      this.statusMsg = 'Marca exactamente una opción correcta por pregunta.';
      this.statusType = 'error';
      return;
    }

    // Agrega opciones validadas
    const options = validOptions.map((o) => ({ text: (o.text || '').trim(), isCorrect: !!o.isCorrect }));
    this.form.questions.push({ text, options });
    // Reinicia la pregunta actual para poder agregar otra
    this.currentQuestion = { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] };
    this.statusMsg = 'Pregunta añadida al quiz.';
    this.statusType = 'success';
  }

  removeQuestionFromForm(idx: number) {
    this.form.questions.splice(idx, 1);
    // ajustar índice de pregunta problemática si es necesario
    if (this.problematicQuestionIndex !== null) {
      if (this.problematicQuestionIndex === idx) {
        this.problematicQuestionIndex = null;
      } else if (this.problematicQuestionIndex > idx) {
        this.problematicQuestionIndex = this.problematicQuestionIndex - 1;
      }
    }
  }

  addQuiz() {
    // Da un mensaje de estado visible para depuración sin abrir la consola del navegador
    //Valida los diferentes campos del quiz antes de agregarlo
    this.statusMsg = '';
    console.log('[GestionQuizzesProfesor] addQuiz called', this.form);
    const title = (this.form.title || '').trim();
    const course = (this.form.course || '').trim();
    const description = (this.form.description || '').trim();

    if (!title) {
      this.statusMsg = 'Por favor completa el título del quiz.';
      this.statusType = 'error';
      return;
    }
    // Verificar título único
    const titleLower = title.toLowerCase();
    const duplicate = this.quizzes.some((q) => (q.title || '').trim().toLowerCase() === titleLower);
    if (duplicate) {
      this.statusMsg = 'Ya existe un quiz con ese título. Usa otro título.';
      this.statusType = 'error';
      return;
    }
    // Verificar límite global de quizzes
    if (this.quizzes.length >= this.MAX_QUIZZES) {
      this.statusMsg = `No puedes crear más de ${this.MAX_QUIZZES} quizzes.`;
      return;
    }
    // Verificar máximo de preguntas
    if (this.form.questions.length > this.MAX_QUESTIONS) {
      this.statusMsg = `El quiz no puede tener más de ${this.MAX_QUESTIONS} preguntas.`;
      this.statusType = 'error';
      return;
    }
    if (!this.form.questions || this.form.questions.length === 0) {
      this.statusMsg = 'Agrega al menos una pregunta al quiz.';
      return;
    }

    for (let i = 0; i < this.form.questions.length; i++) {
      const q = this.form.questions[i];
      const qText = (q.text || '').trim();
      if (!qText) {
        this.statusMsg = `La pregunta ${i + 1} no tiene texto.`;
        this.statusType = 'error';
        this.problematicQuestionIndex = i;
        return;
      }
      const validOptions = q.options.filter((o) => (o.text || '').trim() !== '');
      if (validOptions.length < 2) {
        this.statusMsg = `La pregunta ${i + 1} debe tener al menos 2 opciones.`;
        this.statusType = 'error';
        this.problematicQuestionIndex = i;
        return;
      }
      const correctCount = validOptions.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        this.statusMsg = `La pregunta ${i + 1} debe tener exactamente una opción correcta.`;
        this.statusType = 'error';
        this.problematicQuestionIndex = i;
        return;
      }
    }
    // si todo pasa, limpiar indicador
    this.problematicQuestionIndex = null;

    const quizToAdd: Omit<Quiz, 'id'> = {
      title,
      course,
      description,
      questions: JSON.parse(JSON.stringify(this.form.questions)),
    };
    this.quizService.addQuiz(quizToAdd).subscribe({
      next: (created) => {
        // Resetea el formulario para un nuevo quiz
        this.form = { title: '', course: '', description: '', questions: [] };
        this.currentQuestion = { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] };
        this.showForm = false;
        this.statusMsg = 'Quiz creado correctamente.';
        this.statusType = 'success';
      },
      error: (err) => {
        this.statusMsg = 'Error guardando el quiz en el servidor.';
        this.statusType = 'error';
        try {
          // eslint-disable-next-line no-console
          console.error('[GestionQuizzesProfesor] addQuiz error', err);
        } catch (e) {}
      },
    });
    this.statusType = 'success';
  }
}
