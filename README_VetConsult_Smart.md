# 🐾 VetConsult Smart — Admin Dashboard

<p align="center">
  Sistema administrativo Full-Stack para gerenciamento de usuários, desenvolvido com foco em arquitetura escalável, boas práticas e interface moderna.
</p>

<p align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-backend-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-database-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-frontend-blue)
![License](https://img.shields.io/badge/license-Educacional-lightgrey)

</p>

---

## 📌 Sobre o Projeto

O **VetConsult Smart** é um painel administrativo web desenvolvido para gerenciar usuários de um sistema veterinário.  
O projeto simula a base de administração de uma aplicação real, com arquitetura separada entre front-end e back-end.

Este projeto foi construído com foco em:

- Organização de código profissional
- Arquitetura CRUD completa
- Interface responsiva
- Componentização manual
- Preparação para expansão futura

---

## 🚀 Funcionalidades

- ✅ Cadastro de usuários  
- ✅ Listagem dinâmica  
- ✅ Edição de registros  
- ✅ Exclusão de usuários  
- ✅ Interface responsiva  
- ✅ Máscaras de input (data e telefone)  
- ✅ Menu hamburguer para mobile  
- ✅ Organização por componentes  
- 🔒 Base preparada para autenticação futura  

---

## 🧩 Tecnologias Utilizadas

### 🖥️ Front-end
- HTML5
- CSS3 (arquitetura por componentes)
- TypeScript / JavaScript
- Layout responsivo
- Design System próprio
- Fonte Poppins

### ⚙️ Back-end
- Node.js
- Express
- API REST

### 🗄️ Banco de Dados
- MySQL

### 🧰 Ferramentas
- Git
- GitHub
- NPM

---

## 📂 Arquitetura do Projeto

```text
vetconsult-smart/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── server.ts
│
├── frontend/
│   ├── pages/
│   ├── js/
│   │   ├── components/
│   │   └── pages/
│   ├── css/
│   │   ├── components/
│   │   └── style.css
│
└── README.md
```

---

## ⚙️ Como Executar Localmente

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/vetconsult-smart.git
cd vetconsult-smart
```

---

### 2️⃣ Configurar o Backend

```bash
cd backend
npm install
npm run dev
```

Servidor padrão:

```
http://localhost:3000
```

---

### 3️⃣ Configurar o Banco de Dados

Exemplo de tabela principal:

```sql
CREATE TABLE usuarios_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4️⃣ Abrir o Front-end

Abra no navegador:

```
frontend/pages/admin-usuarios.html
```

---

## 🎨 Identidade Visual

O design foi desenvolvido para transmitir tecnologia, cuidado e confiabilidade na área veterinária.

**Paleta principal:**

- Verde escuro — base institucional  
- Verde vibrante — ações e destaques  
- Branco — limpeza e legibilidade  
- Tons suaves — apoio visual  

**Tipografia:** Poppins  

---

## 📱 Responsividade

O sistema é totalmente adaptável para:

- 💻 Desktop  
- 📱 Smartphones  
- 📟 Tablets  

Inclui:

- Ajustes de layout automático
- Otimização para telas pequenas

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para demonstrar habilidades práticas em desenvolvimento Full-Stack:

- Arquitetura cliente-servidor
- Construção de APIs REST
- Manipulação de banco relacional
- Design responsivo
- Organização escalável de código
- Versionamento profissional com Git

---

## 🔮 Próximas Implementações

- 🔐 Sistema de autenticação (login)
- 👤 Perfis e níveis de acesso
- 📊 Novos módulos administrativos
- ☁️ Deploy em produção
- 🛡️ Melhorias de segurança

---

## 👨‍💻 Autor

**João Vitor Laurindo**

Desenvolvedor em formação focado em desenvolvimento Full-Stack.

[LinkedIn](https://www.linkedin.com/in/joao-lau/) • [Portfólio](#)

---

## 📄 Licença

Este projeto é destinado a fins educacionais e demonstração técnica.

---

## ⭐ Contribuições

Contribuições são bem-vindas para melhorias ou sugestões.
