# School Management System

Sistema de gestão escolar construído com Angular e uma interface moderna e responsiva para controlar estudantes, professores, cursos, notas e configurações acadêmicas.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular" alt="Angular 22" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

## Visão geral

Este projeto foi desenvolvido para centralizar as operações principais de uma instituição de ensino em uma única aplicação web. A interface facilita o acompanhamento acadêmico e administrativo, permitindo visualizar dados, organizar cadastros e manter a rotina escolar mais eficiente.

## Funcionalidades

- Dashboard administrativo com visão geral da instituição
- Cadastro e gerenciamento de alunos
- Cadastro e gerenciamento de professores
- Gestão de cursos e disciplinas
- Controle de notas e avaliações
- Página de configurações do sistema
- Interface moderna com componentes reutilizáveis
- Layout responsivo para desktop e dispositivos menores

## Stack tecnológica

- Angular 22
- TypeScript
- Tailwind CSS
- Spartan UI
- Ng Icons
- RxJS
- Angular Router

## Estrutura do projeto

```bash
src/
├── app/
│   ├── courses/
│   ├── dashboard/
│   ├── grades/
│   ├── layout/
│   ├── professors/
│   ├── settings/
│   ├── shared/
│   └── students/
├── styles.css
├── main.ts
└── index.html
```

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18+
- npm ou yarn
- Angular CLI (opcional, mas útil para desenvolvimento)

## Instalação

```bash
git clone https://github.com/seu-usuario/School-Management-System.git
cd School-Management-System
npm install
```

## Executando o projeto

### Ambiente de desenvolvimento

```bash
npm start
```

O projeto será iniciado em modo de desenvolvimento e normalmente ficará disponível em:

```bash
http://localhost:4200
```

### Build de produção

```bash
npm run build
```

### Testes

```bash
npm test
```

## Scripts disponíveis

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

## Roadmap

- Melhorias na experiência do usuário
- Validações mais robustas de formulários
- Persistência real com backend/API
- Autenticação e autorização
- Relatórios e exportação de dados

## Contribuição

Contribuições são bem-vindas. Para colaborar:

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade
3. Faça o commit das alterações
4. Abra um pull request

## Licença

Este projeto está em desenvolvimento e pode ser utilizado como base para estudos, protótipos ou evolução de sistemas acadêmicos.

## Autor

Desenvolvido como projeto de estudo e aplicação prática para gestão escolar com Angular.

---

Se quiser, posso também criar uma versão mais "premium" para GitHub, com badges, screenshots, roadmap e descrição de arquitetura, ou adaptar o README para um perfil profissional de portfólio.
