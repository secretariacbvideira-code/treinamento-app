'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, HelpCircle } from 'lucide-react';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  const { user, lessons, setProgress, progress } = useAppStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  const lesson = lessons.find((l) => l.id === lessonId);
  const { setUser } = useAppStore();

  useEffect(() => {
    const checkAuth = () => {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser && !user) {
        setUser(JSON.parse(sessionUser));
      } else if (!sessionUser && !user) {
        router.push('/');
      }
    };
    checkAuth();
  }, [user, router, setUser]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Aula não encontrada</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  const questions = lesson.questions || [];
  const currentQ = questions[currentQuestion];

  const handleAnswer = () => {
    if (selectedAnswer === null || !currentQ) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowResult(true);

    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round(
        ((score + (selectedAnswer === currentQ?.correctAnswer ? 1 : 0)) /
          questions.length) *
          100
      );
      setProgress(lessonId, finalScore);
      router.push('/dashboard');
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
            {lesson.title}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5 inline-block mr-2" />
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="w-5 h-5 inline-block mr-2" />
              Quiz ({currentQuestion + 1}/{questions.length})
            </button>
          </div>
        </div>

        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="prose prose-blue max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-transparent p-0">
                {lesson.content}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <span className="text-sm text-gray-500">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mt-2">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    showResult
                      ? index === question.correctAnswer
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : index === selectedAnswer
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-gray-200 text-gray-500'
                      : selectedAnswer === index
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {showResult && index === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showResult &&
                      index === selectedAnswer &&
                      index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {!showResult ? (
              <button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Responder
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {currentQuestion < questions.length - 1
                  ? 'Próxima Pergunta'
                  : 'Finalizar'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}