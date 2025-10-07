# Instruções de Instalação - FonoApp

## Visão Geral

Este pacote contém o sistema completo FonoApp, incluindo:
- Backend (API Flask com PostgreSQL)
- Frontend Web (React com Vite)
- Frontend Mobile (React Native/Expo)
- Documentação completa
- Planos de Marketing e Vendas

## Pré-requisitos

### Para o Backend:
- Python 3.11+
- PostgreSQL 12+
- pip (gerenciador de pacotes Python)

### Para o Frontend Web:
- Node.js 18+
- npm ou yarn

### Para o Frontend Mobile:
- Node.js 18+
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS - apenas macOS)

## Instalação do Backend

1. **Navegue para o diretório do backend:**
   ```bash
   cd fonoaudiologia-system/backend
   ```

2. **Crie e ative um ambiente virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure o banco de dados PostgreSQL:**
   - Crie um banco de dados chamado `fonoapp`
   - Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/fonoapp
   SECRET_KEY=sua_chave_secreta_aqui
   JWT_SECRET_KEY=sua_jwt_secret_key_aqui
   ```

5. **Execute as migrações:**
   ```bash
   flask db upgrade
   ```

6. **Inicie o servidor:**
   ```bash
   python src/main.py
   ```

O backend estará disponível em `http://localhost:5000`

## Instalação do Frontend Web

1. **Navegue para o diretório do frontend web:**
   ```bash
   cd fonoaudiologia-system/frontend-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` com:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O frontend web estará disponível em `http://localhost:3000`

## Instalação do Frontend Mobile

1. **Navegue para o diretório do frontend mobile:**
   ```bash
   cd fonoaudiologia-system/frontend-mobile
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Instale o Expo CLI globalmente (se não tiver):**
   ```bash
   npm install -g @expo/cli
   ```

4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` com:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:5000
   ```

5. **Inicie o projeto:**
   ```bash
   npx expo start
   ```

Use o aplicativo Expo Go no seu dispositivo móvel para testar.

## Deploy para Produção

### Backend (Heroku/Railway/DigitalOcean):
1. Configure as variáveis de ambiente de produção
2. Use um banco PostgreSQL em produção
3. Configure CORS para permitir requisições do frontend

### Frontend Web (Vercel/Netlify):
1. Conecte o repositório
2. Configure a variável `VITE_API_URL` para a URL do backend em produção
3. Execute o build: `npm run build`

### Frontend Mobile (Expo):
1. Configure o `app.json` com as informações do app
2. Execute: `expo build:android` ou `expo build:ios`
3. Publique nas lojas de aplicativos

## Estrutura do Projeto

```
fonoaudiologia-system/
├── backend/                 # API Flask
│   ├── src/
│   │   ├── models/         # Modelos do banco de dados
│   │   ├── routes/         # Rotas da API
│   │   └── main.py         # Arquivo principal
│   └── requirements.txt    # Dependências Python
├── frontend-web/           # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Contextos React
│   │   └── services/       # Serviços de API
│   └── package.json        # Dependências Node.js
├── frontend-mobile/        # Aplicação React Native
│   ├── src/
│   │   ├── screens/        # Telas do app
│   │   ├── navigation/     # Navegação
│   │   └── contexts/       # Contextos
│   └── package.json        # Dependências Node.js
├── docs/                   # Documentação
├── plano_marketing.md      # Plano de Marketing
└── plano_vendas.md         # Plano de Vendas
```

## Funcionalidades Principais

### Para Fonoaudiólogos:
- Dashboard com métricas de pacientes
- Gestão de pacientes
- Criação e atribuição de exercícios
- Agendamento de consultas
- Relatórios de progresso
- Telepráticas (videochamadas)

### Para Pacientes:
- Acesso a exercícios personalizados
- Acompanhamento de progresso
- Agendamento de consultas
- Comunicação com o fonoaudiólogo
- Gamificação dos exercícios

### Recursos Técnicos:
- Autenticação JWT
- Banco de dados PostgreSQL
- Interface responsiva
- Aplicativo mobile nativo
- Integração com APIs externas
- Sistema de notificações

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `/docs/`
2. Verifique os logs de erro
3. Entre em contato com a equipe de desenvolvimento

## Licença

Este projeto está sob licença proprietária. Todos os direitos reservados.

