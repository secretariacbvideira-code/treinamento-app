// ============================================
// TREINAMENTO APP - GOOGLE APPS SCRIPT
// ============================================
// Para usar: Editor de Scripts > Publicar > Implantar como API da Web
// ============================================

const SS_ID = 'SUA_PLANILHA_ID_AQUI'; // Substitua pelo ID da planilha

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback;
    
    let result;
    
    switch (action) {
      case 'login':
        result = login(e.parameter.email, e.parameter.password);
        break;
      case 'register':
        result = register(e.parameter.name, e.parameter.email, e.parameter.password);
        break;
      case 'getLessons':
        result = getLessons();
        break;
      case 'getQuestions':
        result = getQuestions(e.parameter.lessonId);
        break;
      case 'saveProgress':
        result = saveProgress(e.parameter.userId, e.parameter.lessonId, e.parameter.score);
        break;
      case 'saveLesson':
        result = saveLesson(e.parameter.title, e.parameter.content, e.parameter.questions);
        break;
      case 'askAI':
        result = askAI(e.parameter.question);
        break;
      case 'getSettings':
        result = getSettings();
        break;
      case 'updateSettings':
        result = updateSettings(e.parameter.appName, e.parameter.logoUrl);
        break;
      default:
        result = { success: false, error: 'Ação não encontrada' };
    }
    
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(result)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

function login(email, password) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email && data[i][2] === password) {
      return {
        success: true,
        user: {
          id: data[i][0],
          name: data[i][0],
          email: data[i][1]
        }
      };
    }
  }
  
  return { success: false, error: 'Email ou senha inválidos' };
}

function register(name, email, password) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Usuarios');
  const data = sheet.getDataRange().getValues();
  
  // Verificar se email já existe
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      return { success: false, error: 'Email já cadastrado' };
    }
  }
  
  const userId = Date.now().toString();
  sheet.appendRow([userId, email, password, name, new Date()]);
  
  return {
    success: true,
    user: { id: userId, name, email }
  };
}

// ============================================
// FUNÇÕES DE AULAS
// ============================================

function getLessons() {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Aulas');
  
  if (!sheet) {
    return { success: true, lessons: [] };
  }
  
  const data = sheet.getDataRange().getValues();
  const lessons = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      lessons.push({
        id: data[i][0],
        title: data[i][1],
        content: data[i][2]
      });
    }
  }
  
  return { success: true, lessons };
}

function getQuestions(lessonId) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Perguntas');
  
  if (!sheet) {
    return { success: true, questions: [] };
  }
  
  const data = sheet.getDataRange().getValues();
  const questions = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === lessonId) {
      questions.push({
        id: data[i][1],
        question: data[i][2],
        options: [data[i][3], data[i][4], data[i][5], data[i][6]],
        correctAnswer: parseInt(data[i][7])
      });
    }
  }
  
  return { success: true, questions };
}

function saveProgress(userId, lessonId, score) {
  const ss = SpreadsheetApp.openById(SS_ID);
  let sheet = ss.getSheetByName('Progresso');
  
  if (!sheet) {
    sheet = ss.insertSheet('Progresso');
    sheet.appendRow(['UserId', 'LessonId', 'Score', 'Data']);
  }
  
  // Verificar se já tem progresso
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId && data[i][1] === lessonId) {
      sheet.getRange(i + 1, 3).setValue(score);
      sheet.getRange(i + 1, 4).setValue(new Date());
      return { success: true };
    }
  }
  
  sheet.appendRow([userId, lessonId, score, new Date()]);
  return { success: true };
}

function saveLesson(title, content, questionsJson) {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Aulas');
  
  const lessonId = Date.now().toString();
  sheet.appendRow([lessonId, title, content]);
  
  // Salvar perguntas
  const questions = JSON.parse(questionsJson);
  const qSheet = ss.getSheetByName('Perguntas');
  
  for (const q of questions) {
    qSheet.appendRow([lessonId, q.id, q.question, ...q.options, q.correctAnswer]);
  }
  
  return { success: true, lessonId };
}

// ============================================
// IA - GOOGLE GEMINI
// ============================================

function askAI(question) {
  try {
    // Usa Google Gemini API (gratuito)
    const API_KEY = 'SUA_GEMINI_API_KEY'; // Substitua com sua chave
    
    const prompt = `Você é um tutor cristão amoroso. Responda à pergunta de forma clara e breve (máx 200 palavras): ${question}`;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    const answer = result.candidates[0].content.parts[0].text;
    
    return { success: true, answer };
    
  } catch (error) {
    return { success: false, error: 'IA temporariamente indisponível. Tente novamente.' };
  }
}

// ============================================
// CONFIGURAÇÕES
// ============================================

function getSettings() {
  const ss = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName('Config');
  
  if (!sheet) {
    return { success: true, settings: { appName: 'Meu Treinamento', logoUrl: '' } };
  }
  
  const data = sheet.getDataRange().getValues();
  
  return {
    success: true,
    settings: {
      appName: data[1][0] || 'Meu Treinamento',
      logoUrl: data[1][1] || ''
    }
  };
}

function updateSettings(appName, logoUrl) {
  const ss = SpreadsheetApp.openById(SS_ID);
  let sheet = ss.getSheetByName('Config');
  
  if (!sheet) {
    sheet = ss.insertSheet('Config');
    sheet.appendRow(['AppName', 'LogoUrl']);
  }
  
  sheet.getRange(2, 1).setValue(appName);
  sheet.getRange(2, 2).setValue(logoUrl);
  
  return { success: true };
}