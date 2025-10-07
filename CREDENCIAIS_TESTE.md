# Credenciais de Teste - FonoApp

## ⚠️ IMPORTANTE - APENAS PARA DESENVOLVIMENTO

Este arquivo contém as credenciais de teste que foram adicionadas aos botões de "Login Rápido" nas telas de login do sistema. **REMOVER ANTES DO DEPLOY EM PRODUÇÃO**.

## Credenciais Configuradas

### Fonoaudiólogo (Terapeuta)
- **Email:** dra.ana@fonoapp.com
- **Senha:** teste123
- **Tipo:** therapist

### Paciente
- **Email:** maria.paciente@email.com
- **Senha:** teste123
- **Tipo:** patient

## Como Usar

### Frontend Web
1. Acesse a página de login
2. Procure pelo painel amarelo "🧪 Modo de Teste - Login Rápido"
3. Clique em "Login como Fonoaudiólogo" ou "Login como Paciente"
4. O sistema preencherá automaticamente os campos e fará o login

### Frontend Mobile
1. Abra o app e vá para a tela de login
2. Role para baixo até encontrar o painel amarelo de teste
3. Toque em "Login como Fonoaudiólogo" ou "Login como Paciente"
4. O sistema preencherá automaticamente os campos e fará o login

## Configuração no Backend

Para que os logins funcionem, você precisa criar estes usuários no banco de dados ou configurar o backend para aceitar estas credenciais de teste.

### Exemplo de SQL para criar os usuários:

```sql
-- Fonoaudiólogo de teste
INSERT INTO users (name, email, password_hash, user_type, crfa_number, specialization, created_at) 
VALUES (
    'Dra. Ana Carolina Silva',
    'dra.ana@fonoapp.com',
    '$2b$12$hash_da_senha_teste123',  -- Hash da senha 'teste123'
    'therapist',
    'CRFa 12345-SP',
    'Linguagem Infantil',
    NOW()
);

-- Paciente de teste
INSERT INTO users (name, email, password_hash, user_type, birth_date, created_at) 
VALUES (
    'Maria Santos',
    'maria.paciente@email.com',
    '$2b$12$hash_da_senha_teste123',  -- Hash da senha 'teste123'
    'patient',
    '1985-03-15',
    NOW()
);
```

## Localização dos Códigos de Teste

### Frontend Web
- **Arquivo:** `frontend-web/src/pages/Login.jsx`
- **Função:** `handleQuickLogin()`
- **Interface:** Painel amarelo após o formulário de login

### Frontend Mobile
- **Arquivo:** `frontend-mobile/src/screens/LoginScreen.tsx`
- **Função:** `handleQuickLogin()`
- **Interface:** Painel amarelo após o formulário de login

## Remoção para Produção

Antes do deploy em produção, remover:

1. **Frontend Web:**
   - Função `handleQuickLogin()`
   - Todo o bloco HTML do painel de teste (comentado com "REMOVER EM PRODUÇÃO")

2. **Frontend Mobile:**
   - Função `handleQuickLogin()`
   - Todo o bloco JSX do painel de teste (comentado com "REMOVER EM PRODUÇÃO")
   - Estilos relacionados ao teste (`testContainer`, `testButton`, etc.)

3. **Backend:**
   - Remover usuários de teste do banco de dados
   - Remover qualquer lógica específica de teste

## Checklist de Produção

- [ ] Remover função `handleQuickLogin()` do frontend web
- [ ] Remover painel de teste do frontend web
- [ ] Remover função `handleQuickLogin()` do frontend mobile
- [ ] Remover painel de teste do frontend mobile
- [ ] Remover estilos de teste do frontend mobile
- [ ] Remover usuários de teste do banco de dados
- [ ] Deletar este arquivo `CREDENCIAIS_TESTE.md`
- [ ] Verificar se não há outras referências a dados de teste no código

## Segurança

⚠️ **NUNCA** commitar credenciais reais em repositórios de código. Estas são apenas credenciais de teste para desenvolvimento local.

