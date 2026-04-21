# GUIA DE CONFIGURAÇÃO - GOOGLE SHEETS + APPS SCRIPT

Siga estes passos para colocar o app online:

## PASSO 1: CRIAR PLANILHA GOOGLE

1. Acesse: drive.google.com
2. Crie uma nova Planilha Google
3. Renomeie para "TreinamentoApp"
4. Crie as seguintes abas (folhas):
   - **Usuarios** - Para login/cadastro
   - **Aulas** - Conteúdo das aulas
   - **Perguntas** - Quiz
   - **Progresso** - Notas dos alunos
   - **Config** - Nome do app e logo

## PASSO 2: CONFIGURAR CABEÇALHOS

Na aba **Usuarios** (linha 1):
```
A1: ID    B1: Email    C1: Senha    D1: Nome    E1: Data
```

Na aba **Aulas**:
```
A1: ID    B1: Título    C1: Conteúdo
```

Na aba **Perguntas**:
```
A1: LessonId    B1: ID    C1: Pergunta    D1: Opção1    E1: Opção2    F1: Opção3    G1: Opção4    H1: Correta
```

Na aba **Config**:
```
A1: AppName    B1: LogoUrl
```

## PASSO 3: COPIAR ID DA PLANILHA

1. Abra a planilha
2. Observe a URL: docs.google.com/spreadsheets/d/**ID_AQUI**/edit
3. Copie o ID (parte entre /d/ e /edit)

## PASSO 4: APPS SCRIPT

1. Acesse: script.google.com
2. Novo Projeto
3. Abra o arquivo `src/apps-script/Code.gs` criado
4. Cole o código no editor
5. Substitua `const SS_ID = 'SUA_PLANILHA_ID_AQUI'` pelo ID da sua planilha

## PASSO 5: IMPLANTAR API

1. No editor Apps Script, clique em "Implantar"
2. Selecione "Nova implantação"
3. Escolha "API executável"
4. Defina quem pode acessar: "Qualquer um"
5. Clique em "Implantar"
6. Copie a **URL da API gerada**

## PASSO 6: GEMINI API (Opcional - IA)

1. Acesse: aistudio.google.com/app/apikey
2. Gere uma chave API gratuita
3. No Apps Script, substitua `const API_KEY = 'SUA_GEMINI_API_KEY'`

## PASSO 7: ATUALIZAR APP

1. Edite o arquivo `src/lib/api.ts`
2. Substitua `const API_URL = 'SUA_API_URL'` pela URL do Apps Script
3. Execute `npm run build`
4. Faça deploy na Vercel (gratuito)

---

## ESTRUTURA DAS AULAS

Para adicionar uma aula, preencha a aba **Aulas**:
- Coluna A: ID (ex: 1)
- Coluna B: Título (ex: "Quem é Jesus")
- Coluna C: Conteúdo (texto completo)

E na aba **Perguntas**:
- Multiple linhas com o LessonId correspondente

## DÚVIDAS?

O sistema armazena tudo no Google Sheets - sem custo, sem límite!