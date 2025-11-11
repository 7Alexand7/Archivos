import { Router, Request, Response } from 'express';
import { QuizService } from '../services/quiz.service';

export const quizRouter = Router();
const quizService = new QuizService();

quizRouter.get('/', (req: Request, res: Response): void => {
  const courseId = req.query['courseId'] as string;
  
  if (courseId) {
    const quizzes = quizService.getQuizzesByCourse(courseId);
    res.json(quizzes);
    return;
  }
  
  const quizzes = quizService.getAllQuizzes();
  res.json(quizzes);
});

quizRouter.get('/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params['id']);
  const quiz = quizService.getQuizById(id);
  
  if (!quiz) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }
  
  res.json(quiz);
});

quizRouter.post('/', (req: Request, res: Response): void => {
  const { title, course, description, questions } = req.body;
  
  if (!title || !questions || questions.length === 0) {
    res.status(400).json({ error: 'Title and questions are required' });
    return;
  }
  
  const newQuiz = quizService.createQuiz({ title, course, description, questions });
  res.status(201).json(newQuiz);
});

quizRouter.put('/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params['id']);
  const updatedQuiz = quizService.updateQuiz(id, req.body);
  
  if (!updatedQuiz) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }
  
  res.json(updatedQuiz);
});

quizRouter.delete('/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params['id']);
  const deleted = quizService.deleteQuiz(id);
  
  if (!deleted) {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }
  
  res.status(204).send();
});
