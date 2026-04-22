# 📋 Gerenciador de tarefas

Uma API para um sistema de gerenciamento de tarefas. Os usuários poderão criar contas, autenticar-se com segurança e gerenciar suas tarefas. Cada tarefa poderá ser atribuída a membros do time, classificada por status e prioridade, e o progresso poderá ser acompanhado de forma simples e organizada. <br><br>

## 🌐 Deploy

Acesse a aplicação em:

https://gerenciador-de-tarefas-0qta.onrender.com

## ⚙️ Rodando localmente

### Clonar repositorio

```bash
git clone https://github.com/nawarakk/Gerenciador-de-tarefas.git
```
```bash
cd Gerenciador-de-tarefas
```
### Instalar dependências

```bash
npm i
```

### Rodar migrations
```bash
npm run migrate
```

### Iniciar projeto
```bash
npm run dev
```

<br>

## 📡 Endpoints

### Usuários

POST `/users`

```json
{
    "name": "Nome",
    "email": "email@email.com",
    "password": "123456"
}
```

<br>

---

### Sessões

POST `/sessions`

```json
{
    "email": "email@email.com",
    "password": "123456"
}
```

<br>

---

### Time

POST `/teams`

```json
{
    "name": "Name",
    "description": "Description"
}
```
<br>

GET `/teams`

<br>

PATCH `/teams/:team_id`

```json
{
    "name": "Name",
    "description": "Description"
}
```
<br>

DELETE `/teams/:team_id`

<br>

---

### Membros do time

POST `/team-members`

```json
{
    "user_id": "1",
    "team_id": "1"
}
```

<br>

GET `/team-members`

<br>

DELETE `/team-members/:teamMember_id`

<br>

---

### Task

POST `/task`
```json
{
    "title": "Título",
    "description": "Descrição",
    "user_id": "1",
    "team_id": "1"
}
```

<br>

GET `/task`

<br>

PATCH `/task/:task_id`
```json
{
    "title": "Título",
    "description": "Descrição"
}
```

<br>

GET `/task/status/:status`

<br>

GET `/task/priority/:priority`

<br>

PATCH `/task/assign/:task_id`
```json
{
    "user_id": "1",
    "team_id": "1"
}
```

<br>

---

### Histórico de Status

GET `/tasks-history/:task_id`

<br>

PATCH  `/tasks-history/:task_id`
```json
{
    "status": "pending"
}
```

## ❗ Observações

* API roda por padrão em: http://localhost:3333
* Para rotas protegidas, enviar token JWT no header:
  - Authorization: Bearer {token}

