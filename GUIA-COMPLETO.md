# TREINAMENTO APP - GUIA COMPLETO

## O QUE FOI CRIADO

Um web app moderno e responsivo para treinamentos com:
- Login/cadastro de usuários
- Aulas com conteúdo (texto)
- Quiz interativo com perguntas e respostas
- Configurações (nome do app + logo do Google Drive)
- Integração com IA (Gemini) - Opcional
- 100% gratuito

---

## COMO RODAR LOCALMENTE

```bash
cd treinamento-app
npm run dev
```

Abra: http://localhost:3000

---

## COMO COLOCAR ONLINE (GRATUITO)

### OPÇÃO 1: VERCEL (Recomendado)

1. Crie uma conta em vercel.com
2. Instale: `npm i -g vercel`
3. Execute: `vercel`
4. Siga as instruções na tela

### OPÇÃO 2: NETLIFY

1. Execute: `npm run build`
2. Faça upload da pasta `.output/public` em netlify.com

---

## CONFIGURAR GOOGLE SHEETS (Banco de Dados)

### Passo 1: Criar Planilha

1. Acesse: drive.google.com
2. Crie uma nova Planilha Google
3. Renomeie para "TreinamentoApp"

### Passo 2: Criar Abas

Crie as seguintes abas (clique no +):
- Usuarios
- Aulas
- Perguntas
- Config

### Passo 3: Configurar Cabeçalhos

**Aba Usuarios (linha 1):**
```
A1: id    B1: email    C1: senha    D1: nome
```

**Aba Aulas:**
```
A1: id    B1: titulo    C1: conteudo
```

**Aba Perguntas:**
```
A1: lessonId    B1: id    C2: pergunta    C: opcao1    D: opcao2    E: opcao3    F: opcao4    G: correta
```

**Aba Config:**
```
A1: appName    B1: logoUrl
```

### Passo 4: Tornar Pública

1. Arquivo > Publicar na web
2. Escolha "Página da Web" > "Publicar"
3. Copie o link gerado

### Passo 5: Atualizar no Código

Edite: `src/lib/api.ts`

Substitua:
```javascript
const SHEET_JSON_URL = 'SUA_URL_DA_PUBLISH_API';
```

Cole o link da planilha publicada.

---

## ESTRUTURA DAS AULAS

Para adicionar uma aula na planilha:

**Aba Aulas:**
- Coluna A: `1` (ID único)
- Coluna B: "Quem é Jesús"
- Coluna C: Conteúdo completo (você pode usar Enter para parágrafos)

**Aba Perguntas:**
- Multiple linhas com lessonId = "1"
- Coluna correta: 0, 1, 2, ou 3 (índice da resposta correta)

---

## USAR IA (GEMINI) - OPCIONAL

1. Acesse: aistudio.google.com/app/apikey
2. Gere uma chave API gratuita
3. Edite o arquivo `src/lib/api.ts`
4. Configure a integração com Gemini

---

## ARQUIVOS DO PROJETO

```
treinamento-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          (Login)
│   │   ├── dashboard/        (Lista de aulas)
│   │   ├── lesson/[id]/      (Visualizador + Quiz)
│   │   └── settings/        (Configurações)
│   ├── store/
│   │   └── useAppStore.ts  (Estado)
│   └── lib/
│       └── api.ts         (Conexão Sheets)
├── package.json
└── README.md
```

---

## DÚVIDAS COMUNS

**É gratuito?**
Sim! Vercel + Google Sheets = 100% gratuito, sem limites.

**Quantos usuários suporta?**
Ilimitados no Google Sheets.

**Funciona no celular?**
Sim, é responsivo.

**Posso usar OFFLINE?**
Sim, funciona localmente com dados no navegador.

---

## PRÓXIMOS PASSOS

1. Testar local: `npm run dev`
2. Criar planilha Google
3. Configurar aulas na planilha
4. Fazer deploy na Vercel
5. Compartilhar link!