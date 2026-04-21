// API Configuration
// Para usar:
// 1. Tornar a planilha pública na web (Arquivo > Publicar na web > JSON)
// 2. Copiar o link de publicação aqui

const SHEET_JSON_URL = '1HwJvFV3QLJxc9RKsoUJuQ7hzGgqRi-7230ZvraHmHYg';

const isOnlineMode = true;

const defaultLessons = [
  {
    id: '1',
    title: 'Quem é Jesus',
    content: `JESUS CRISTO: O FILHO DE DEUS

Jesús Cristo é o filho de Deus, enviado ao mundo para nos salvar. Ele nasceu em Belém, numa estrebaria, há mais de 2000 anos.

SUA MISSÃO
- Ensinar sobre o amor de Deus
- Curar doenças
- Perdoar pecados
- Dar a vida por nós

SUA VIDA
Jesús cresceu em Nazareth, foi batizado por João Batista, e começou seu ministério aos 30 anos.

SUA MORTE
Ele morreu na cruz para pagar pelos nossos pecados. No terceiro dia, ressuscitou!

SUA VOLTA
Jesús prometeu voltar para buscar aqueles que creem nEle.

Este é o evangelho - a boa nova - que devemos compartilhar com outros!`,
    questions: [
      { id: 'q1', question: 'Quem foi enviado ao mundo para nos salvar?', options: ['Moisés', 'Jesus Cristo', 'Paulo', 'Pedro'], correctAnswer: 1 },
      { id: 'q2', question: 'Onde Jesús nasceu?', options: ['Jerusalém', 'Nazaré', 'Belém', 'Cafarnaum'], correctAnswer: 2 },
      { id: 'q3', question: 'Quantos anos tinha Jesús quando começou seu ministério?', options: ['18 anos', '25 anos', '30 anos', '35 anos'], correctAnswer: 2 },
      { id: 'q4', question: 'O que Jesús fez no terceiro dia?', options: ['Subiu ao céu', 'Ressuscitou', 'Voltou para Nazaré', 'Nada'], correctAnswer: 1 },
      { id: 'q5', question: 'Qual era a missão principal de Jesús?', options: ['Ensinar sobre o amor de Deus', 'Curar doenças', 'Perdoar pecados', 'Todas anteriores'], correctAnswer: 3 },
    ]
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  questions?: any[];
}

export interface Settings {
  appName: string;
  logoUrl: string;
}

let cachedSettings: Settings = { appName: 'Meu Treinamento', logoUrl: '' };
let cachedLessons: Lesson[] = [];

async function fetchSheetData(): Promise<any | null> {
  try {
    const response = await fetch(SHEET_JSON_URL);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export const api = {
  async checkConnection(): Promise<boolean> {
    if (!isOnlineMode) return false;
    const data = await fetchSheetData();
    return data !== null;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isOnlineMode) {
      const data = await fetchSheetData();
      if (data && data.usuarios) {
        const user = data.usuarios.find((u: any) => u.email === email && u.senha === password);
        if (user) return { success: true, user: { id: user.id, name: user.nome, email: user.email } };
      }
    }
    
    // Fallback local
    const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email);
    if (foundUser) return { success: true, user: foundUser };
    
    return { success: false, error: 'Email ou senha inválidos' };
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isOnlineMode) {
      // Salvar na planilha requer API de escrita - por agora usa local
    }
    
    // Fallback local
    const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
    if (savedUsers.find((u: any) => u.email === email)) {
      return { success: false, error: 'Email já cadastrado' };
    }
    
    const newUser = { id: Date.now().toString(), name, email };
    savedUsers.push(newUser);
    localStorage.setItem('treinamento-users', JSON.stringify(savedUsers));
    
    return { success: true, user: newUser };
  },

  async getLessons(): Promise<{ success: boolean; lessons: Lesson[] }> {
    if (isOnlineMode) {
      const data = await fetchSheetData();
      if (data && data.aulas) {
        const lessons = data.aulas.map((a: any) => ({
          id: a.id,
          title: a.titulo,
          content: a.conteudo,
          questions: data.perguntas?.filter((p: any) => p.lessonId === a.id).map((p: any) => ({
            id: p.id,
            question: p.pergunta,
            options: [p.opcao1, p.opcao2, p.opcao3, p.opcao4],
            correctAnswer: p.correta
          }))
        }));
        if (lessons.length > 0) return { success: true, lessons };
      }
    }
    
    return { success: true, lessons: defaultLessons };
  },

  async getSettings(): Promise<{ success: boolean; settings: Settings }> {
    if (isOnlineMode) {
      const data = await fetchSheetData();
      if (data && data.config && data.config[0]) {
        cachedSettings = { appName: data.config[0].appName || 'Meu Treinamento', logoUrl: data.config[0].logoUrl || '' };
      }
    }
    return { success: true, settings: cachedSettings };
  },

  async saveProgress(userId: string, lessonId: string, score: number): Promise<{ success: boolean }> {
    const progress = JSON.parse(localStorage.getItem('treinamento-progress') || '{}');
    progress[lessonId] = score;
    localStorage.setItem('treinamento-progress', JSON.stringify(progress));
    return { success: true };
  },

  async askAI(question: string): Promise<{ success: boolean; answer?: string }> {
    // Simulação de resposta da IA - em produção, conectar com Gemini
    const responses: Record<string, string> = {
      'jesus': 'Jesús é o filho de Deus, enviado para nos salvar. Ele morreu na cruz por nossos pecados e ressuscitou!',
      'fé': 'A fé é acreditar em Deus e em Seu filho Jesús Cristo. É através da fé que temos salvação.',
      'oração': 'A oração é a comunicação com Deus. Podemos orar a qualquer momento, em qualquer lugar.',
      'amor': 'O amor de Deus é infinito e incondicional. Ele nos ama como somos.',
      'default': 'Jesús disse: "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim." João 14:6'
    };
    
    const lowerQuestion = question.toLowerCase();
    let answer = responses.default;
    
    for (const key in responses) {
      if (lowerQuestion.includes(key)) {
        answer = responses[key];
        break;
      }
    }
    
    return { success: true, answer };
  }
};