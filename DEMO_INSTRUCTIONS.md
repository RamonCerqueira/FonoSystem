# 🚀 Instruções para Demonstração - FonoApp

## ⚡ Início Rápido (Sem Banco de Dados)

Este sistema foi configurado para funcionar **independentemente de banco de dados** para facilitar a demonstração. Todos os dados são simulados (mock) e armazenados localmente.

## 🔑 Credenciais de Teste

### Fonoaudiólogo
- **Email:** `dra.ana@fonoapp.com`
- **Senha:** `teste123`

### Paciente
- **Email:** `maria.paciente@email.com`
- **Senha:** `teste123`

## 🖥️ Como Rodar o Frontend Web

1. **Abra o terminal na pasta do projeto:**
   ```bash
   cd fonoaudiologia-system/frontend-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

5. **Faça login usando:**
   - Os botões de "Login Rápido" (painel amarelo)
   - OU digite as credenciais manualmente

## 📱 Como Rodar o Frontend Mobile

1. **Instale o Expo CLI (se não tiver):**
   ```bash
   npm install -g @expo/cli
   ```

2. **Navegue para a pasta mobile:**
   ```bash
   cd fonoaudiologia-system/frontend-mobile
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o projeto:**
   ```bash
   npx expo start
   ```

5. **Teste no dispositivo:**
   - Instale o app "Expo Go" no seu celular
   - Escaneie o QR code que aparece no terminal
   - Use as credenciais de teste para fazer login

## 🎯 Funcionalidades Disponíveis

### Para Fonoaudiólogos:
- ✅ Dashboard com métricas
- ✅ Gestão de pacientes (visualizar, adicionar, editar)
- ✅ Biblioteca de exercícios por categoria
- ✅ Agendamento de consultas
- ✅ Perfil profissional
- ✅ Relatórios de progresso

### Para Pacientes:
- ✅ Dashboard personalizado
- ✅ Exercícios atribuídos
- ✅ Histórico de consultas
- ✅ Perfil pessoal
- ✅ Progresso gamificado

## 🎨 Recursos Implementados

### Design e UX:
- ✅ Interface moderna e responsiva
- ✅ Paleta de cores específica para fonoaudiologia
- ✅ Componentes acessíveis (WCAG)
- ✅ Animações suaves
- ✅ Feedback visual consistente

### Funcionalidades Técnicas:
- ✅ Autenticação simulada
- ✅ Roteamento protegido
- ✅ Estados de loading
- ✅ Tratamento de erros
- ✅ Dados mock realistas
- ✅ Responsividade total

## 🔧 Estrutura dos Dados Mock

### Pacientes:
- João Silva (8 anos) - Atraso de linguagem
- Ana Beatriz (5 anos) - Distúrbio fonológico  
- Carlos Eduardo (11 anos) - Gagueira

### Exercícios por Categoria:
- **Voz:** Exercícios de respiração
- **Fala:** Articulação do som /R/
- **Linguagem:** Vocabulário temático
- **Audição:** Discriminação auditiva
- **Motricidade:** Mobilidade orofacial

### Agendamentos:
- Consultas presenciais e online
- Diferentes status (agendado, confirmado, realizado)
- Horários variados

## 🚨 Importante para Produção

**ANTES DE COLOCAR EM PRODUÇÃO:**

1. **Remover dados mock:**
   - Deletar `src/services/mockData.js` (web)
   - Deletar `src/services/mockData.ts` (mobile)

2. **Restaurar API real:**
   - Reconfigurar `src/services/api.js` para usar backend real
   - Reconfigurar `src/contexts/AuthContext.jsx` para usar API

3. **Remover botões de teste:**
   - Remover painéis amarelos de "Login Rápido"
   - Remover funções `handleQuickLogin()`

4. **Configurar banco de dados:**
   - PostgreSQL em produção
   - Variáveis de ambiente corretas

## 📞 Suporte

Se tiver algum problema para rodar a demonstração:

1. Verifique se o Node.js está instalado (versão 18+)
2. Limpe o cache: `npm cache clean --force`
3. Delete node_modules e reinstale: `rm -rf node_modules && npm install`
4. Verifique se não há conflitos de porta (3000 para web)

## 🎉 Próximos Passos

Após a demonstração, podemos:
- Integrar com banco de dados real
- Implementar autenticação JWT
- Adicionar mais funcionalidades específicas
- Configurar deploy em produção
- Implementar testes automatizados

---

**Desenvolvido por Manus AI** 🤖  
*Sistema completo de fonoaudiologia com foco na experiência do usuário*

