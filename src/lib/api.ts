// API Configuration
// Para usar:
// 1. Tornar a planilha pública na web (Arquivo > Publicar na web > CSV)
// 2. Copiar o link de publicação aqui

const SHEET_ID = '1HwJvFV3QLJxc9RKsoUJuQ7hzGgqRi-7230ZvraHmHYg';

const isOnlineMode = true;

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

const defaultLessons = [
  {
    id: '1',
    title: 'Quem é Jesus',
    content: `JESUS CRISTO: O FILHO DE DEUS

Jesús Cristo é o filho de Deus, enviado ao mundo para nos salvar. Ele nasceu em Belém, há mais de 2000 anos.

SUA MISSÃO
- Ensinar sobre o amor de Deus
- Curar doenças
- Perdoar pecados
- Dar a vida por nós

SUA MORTE
Ele morreu na cruz para pagar pelos nossos pecados. No terceiro dia, ressuscitou!

SUA VOLTA
Jesús prometeu voltar para buscar aqueles que creem nEle.`,
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

function csvToArray(csv: string): any[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/"/g, '').trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    result.push(obj);
  }
  
  return result;
}

async function fetchSheet(sheetName: string): Promise<any[]> {
  try {
    const response = await fetch(SHEET_CSV_URL + encodeURIComponent(sheetName));
    if (!response.ok) return [];
    const csv = await response.text();
    return csvToArray(csv);
  } catch {
    return [];
  }
}

export const api = {
  async checkConnection(): Promise<boolean> {
    if (!isOnlineMode) return false;
    const data = await fetchSheet('Config');
    return data.length > 0 || true;
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (isOnlineMode) {
      try {
        const users = await fetchSheet('Usuarios');
        const user = users.find((u: any) => u.email === email && u.senha === password);
        if (user) return { success: true, user: { id: user.id, name: user.nome, email: user.email } };
      } catch {}
    }
    
    const savedUsers = JSON.parse(localStorage.getItem('treinamento-users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email);
    if (foundUser) return { success: true, user: foundUser };
    
    return { success: false, error: 'Email ou senha inválidos' };
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
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
      try {
        const aulas = await fetchSheet('Aulas');
        const perguntas = await fetchSheet('Perguntas');
        
        if (aulas.length > 0) {
          const lessons = aulas.map((a: any) => ({
            id: a.id,
            title: a.titulo,
            content: a.conteudo,
            questions: perguntas.filter((p: any) => p.lessonId === a.id).map((p: any) => ({
              id: p.id,
              question: p.pergunta,
              options: [p.opcao1, p.opcao2, p.opcao3, p.opcao4],
              correctAnswer: parseInt(p.correta) || 0
            }))
          }));
          return { success: true, lessons };
        }
      } catch {}
    }
    
    return { success: true, lessons: defaultLessons };
  },

  async getSettings(): Promise<{ success: boolean; settings: Settings }> {
    if (isOnlineMode) {
      try {
        const config = await fetchSheet('Config');
        if (config.length > 0 && config[0]) {
          cachedSettings = { 
            appName: config[0].appName || 'Meu Treinamento', 
            logoUrl: config[0].logoUrl || '' 
          };
        }
      } catch {}
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
    const responses: Record<string, string> = {
      'jesus': 'Jesús é o filho de Deus, enviado para nos salvar.',
      'fé': 'A fé é acreditar em Deus e em Seu filho Jesús Cristo.',
      'oração': 'A oração é a comunicação com Deus.',
      'amor': 'O amor de Deus é infinito e incondicional.',
      'default': 'Jesús disse: "Eu sou o caminho, a verdade e a vida." João 14:6'
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