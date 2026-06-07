# 🐾 VetConsult Smart

<p align="center">
  Sistema Full-Stack para gerenciamento de tutores, pets e agendamentos veterinários.
</p>

<p align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-backend-lightgrey)
![MySQL](https://img.shields.io/badge/MySQL-database-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-backend-blue)
![License](https://img.shields.io/badge/license-Educacional-lightgrey)

</p>

---

# 📌 Sobre o Projeto

O **VetConsult Smart** é um sistema web desenvolvido para auxiliar no gerenciamento de clínicas veterinárias, oferecendo funcionalidades para administração de usuários, cadastro de tutores, gerenciamento de pets e controle de agendamentos.

O projeto está sendo desenvolvido como atividade acadêmica do curso de **Análise e Desenvolvimento de Sistemas da Faculdade Impacta**, aplicando conceitos de:

- Engenharia de Software
- Arquitetura Cliente-Servidor
- APIs REST
- Banco de Dados Relacional
- Segurança com JWT
- Desenvolvimento Full-Stack

---

# 🚀 Funcionalidades Implementadas

## 👨‍💼 Administração

- ✅ Login de administradores
- ✅ Autenticação via JWT
- ✅ Cadastro de administradores
- ✅ Visualização de administradores
- ✅ Edição de administradores
- ✅ Exclusão de administradores
- ✅ Controle de Administrador Master
- ✅ Dashboard administrativo com indicadores

---

## 👤 Tutores

- ✅ Cadastro de tutores
- ✅ Login de tutores
- ✅ Reativação automática de contas inativas
- ✅ Edição de perfil
- ✅ Inativação de conta
- ✅ Exclusão definitiva de conta
- ✅ Dashboard do tutor

---

## 🐾 Pets

- ✅ Cadastro de pets
- ✅ Listagem de pets
- ✅ Visualização de pets
- ✅ Edição de pets
- ✅ Exclusão de pets
- ✅ Associação automática ao tutor logado
- ✅ Exibição de pets no dashboard

---

## 📅 Agendamentos

- ✅ Cadastro de agendamentos
- ✅ Listagem de agendamentos
- ✅ Edição de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Atualização dinâmica dos dashboards
- ✅ Controle de disponibilidade dos pets para agendamento

---

# 🧩 Tecnologias Utilizadas

## 🖥️ Front-end

- HTML5
- CSS3
- JavaScript (ES6+)
- Design Responsivo
- Fonte Poppins

---

## ⚙️ Back-end

- Node.js
- TypeScript
- Express
- JWT (JSON Web Token)
- Bcrypt

---

## 🗄️ Banco de Dados

- MySQL

---

## 🧰 Ferramentas

- Git
- GitHub
- MySQL Workbench
- NPM
- VS Code

---

# 📂 Estrutura do Projeto

```text
vetconsult-smart/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   │   └── pages/
│   └── pages/
│
└── README.md
```

---

# ⚙️ Como Executar Localmente

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/vetconsult-smart.git

cd vetconsult-smart
```

---

## 2️⃣ Configurar o Banco de Dados

Criar um banco chamado:

```sql
CREATE DATABASE vetconsult_smart_db;
```

Importar o script SQL do projeto contendo as tabelas:

- usuarios_admin
- tutores
- pets
- agendamentos

---

## 3️⃣ Configurar Variáveis de Ambiente

Criar um arquivo `.env` dentro da pasta backend:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=vetconsult_smart_db

JWT_SECRET=sua_chave_secreta
```

---

## 4️⃣ Executar o Backend

```bash
cd backend

npm install

npm run dev
```

Servidor:

```text
http://localhost:3000
```

---

## 5️⃣ Executar o Front-end

Abra os arquivos utilizando o Live Server do VS Code.

Exemplos:

```text
frontend/pages/login-admin.html
```

ou

```text
frontend/pages/login-tutor.html
```

---

# 🎨 Identidade Visual

Paleta principal utilizada no projeto:

| Cor | Hex |
|------|------|
| Verde Escuro | #0B1D18 |
| Verde Primário | #14D09B |
| Verde Destaque | #00FFB7 |
| Fundo Claro | #EFF9F6 |
| Branco | #FFFFFF |

**Tipografia:** Poppins

---

# 📱 Responsividade

O sistema foi desenvolvido para funcionamento em:

- 💻 Desktop
- 📱 Smartphones
- 📟 Tablets

Possuindo adaptação automática de layout para diferentes resoluções.

---

# 🎯 Objetivos do Projeto

O VetConsult Smart tem como objetivo aplicar conhecimentos de desenvolvimento Full-Stack através da construção de um sistema de gerenciamento veterinário.

Principais conceitos aplicados:

- APIs REST
- Arquitetura em camadas
- CRUD completo
- Segurança com JWT
- Hash de senhas com Bcrypt
- Relacionamentos em banco de dados
- Integração Front-End e Back-End
- Boas práticas de organização de código

---

# 🔮 Próximas Implementações

- 📄 Prontuário veterinário
- 🧪 Gestão de exames
- 📷 Foto de perfil do tutor
- 🐶 Foto dos pets
- ☁️ Deploy em produção
- 📊 Relatórios e métricas

---

# 👨‍💻 Autor

**João Vitor Laurindo**

Desenvolvedor Full-Stack em formação, apaixonado por tecnologia, desenvolvimento web e arquitetura de software.

🔗 LinkedIn:
https://www.linkedin.com/in/joao-lau/

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais.

---

# ⭐ Status do Projeto

🚧 Em desenvolvimento — funcionalidades de administração, tutores, pets e agendamentos concluídas. Próximas etapas incluem prontuários veterinários, exames e melhorias de experiência do usuário.