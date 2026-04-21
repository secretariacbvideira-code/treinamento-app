'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, type Lesson } from '@/store/useAppStore';
import { BookOpen, Settings, LogOut, Play, ChevronRight, Menu, X } from 'lucide-react';

const defaultLessons: Lesson[] = [
  {
    id: '1',
    title: 'Quem é Jesus',
    content: `JESUS CRISTO: O FILHO DE DEUS

Jesu00eds Cristo u00e9 o filho de Deus, enviado ao mundo para nos salvar. Ele nasceu em Belu00e9m, numa estalu00e9bua, h{u00e1} mais de 2000 anos.

SUA MISSÃO
- Ensinar sobre o amor de Deus
- Curar doenu00e7as
- Perdoar peccados
- Darexample a vida por nu00f3s

SUA VIDA
Jesu00eds cresceu em Nazar{u00e9}, foi batizado por Jo{u00e3}o Batista, ecomeceu seu minist{u00e9}rio aos 30 anos.

SUA MORTE
Ele morreu na cruz para pagar pelos nossos peccados. No terceiro dia, ressuscitou!

SUA VOLTA
Jesu00eds prometeu voltar para buscar aqueles que creem nEle.

Este u00e9 o evangelho - a boa nova - que devemos compartilhar com outros!`,
    questions: [
      {
        id: 'q1',
        question: ' Quem foi enviado ao mundo para nos salvar?',
        options: ['Moisés', 'Jesus Cristo', 'Paulo', 'Pedro'],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        question: ' Onde Jesus nasceu?',
        options: ['Jerusalém', 'Nazaré', 'Belém', 'Cafarnaum'],
        correctAnswer: 2,
      },
      {
        id: 'q3',
        question: 'Quantos anos tinha Jesus quando começou seu ministry?',
        options: ['18 anos', '25 anos', '30 anos', '35 anos'],
        correctAnswer: 2,
      },
      {
        id: 'q4',
        question: 'O que Jesus fez no terceiro dia?',
        options: ['Subiu ao céu', 'Ressuscitou', 'Voltou para Nazaré', 'Nada'],
        correctAnswer: 1,
      },
      {
        id: 'q5',
        question: 'Qual era a missão principal de Jesus?',
        options: [
          'Ensinar sobre o amor de Deus',
          'Curar doenças',
          'Perdoar pecados',
          'Todas anteriores',
        ],
        correctAnswer: 3,
      },
    ],
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, settings, lessons, setLessons, progress } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (lessons.length === 0) {
      setLessons(defaultLessons);
    }
  }, [user, router, lessons, setLessons]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {settings.appName || 'Meu Treinamento'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:block text-gray-600">
              Olá, {user?.name}
            </span>
            <button
              onClick={() => router.push('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Suas Aulas</h2>
          <p className="text-gray-500 mt-1">
            Continue aprendendo e crescendo na fé
          </p>
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/lesson/${lesson.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lesson.questions?.length || 0} perguntas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {progress[lesson.id] !== undefined && (
                    <span className="text-sm font-medium text-green-600">
                      {progress[lesson.id]}% aproveitamento
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma aula disponível ainda.</p>
          </div>
        )}
      </main>
    </div>
  );
}