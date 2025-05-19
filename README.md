# GutsApi Project

A full-stack project with a FastAPI backend and a React (Vite) frontend.

---

## Project Structure

```
GutsApi/
│
├── backEnd/         # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routers
│   │   ├── core/        # Core logic (e.g., security, config)
│   │   ├── db/          # Database config and session
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── __init__.py
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── frontEnd/        # React frontend (Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

## Setup

### Backend

```bash
cd backEnd
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- The backend will be available at `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontEnd
npm install
npm run dev
```

- The frontend will be available at the URL shown in your terminal (usually `http://localhost:5173`).

---

## Environment Variables

- Add a `.env.example` file in both `backEnd` and `frontEnd` directories to document required environment variables.
- Copy `.env.example` to `.env` and fill in your values as needed.

---

## Backend Features

- **RESTful API** for items and users
- **Authentication** (login, register, protected routes)
- **CORS** enabled for frontend-backend communication
- **SQLAlchemy** for database ORM
- **Pydantic** for data validation
- **Auto-generated docs** at `/docs`

---

## Main API Routes

### Item Routes

| Method | Endpoint             | Description                | Auth Required |
|--------|----------------------|----------------------------|--------------|
| GET    | `/items/`            | List all items             | Yes          |
| GET    | `/items/{item_id}`   | Get item by ID             | Yes          |
| POST   | `/items/`            | Create new item            | Yes          |
| PUT    | `/items/{item_id}`   | Update item by ID          | Yes          |
| DELETE | `/items/{item_id}`   | Delete item by ID          | Yes          |

### User Routes

| Method | Endpoint             | Description                | Auth Required |
|--------|----------------------|----------------------------|--------------|
| POST   | `/users/`            | Register new user          | No           |
| GET    | `/users/`            | List all users             | Yes (admin)  |
| GET    | `/users/{user_id}`   | Get user by ID             | Yes          |
| POST   | `/users/login`       | Login                      | No           |
| POST   | `/users/logout`      | Logout                     | Yes          |

---

## Authentication

- Uses OAuth2 password flow with JWT tokens.
- Register via `POST /users/`
- Login via `POST /users/login` (returns access token)
- Pass the token as `Authorization: Bearer <token>` in API requests.
- Protected endpoints require authentication.

---

## Example: Register & Login

**Register:**
```bash
curl -X POST http://localhost:8000/users/ -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"testpass"}'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/users/login?username=testuser&password=testpass"
```

**Use the returned token:**
```bash
curl -H "Authorization: Bearer <your_token>" http://localhost:8000/items/
```

---

## Frontend

- Built with React + Vite
- Uses Zustand for state management
- Auth and CRUD operations are integrated with the backend API

---

## Docker

You can use `docker-compose.yml` at the project root to run both backend and frontend in containers.

---

## License

MIT (or your preferred license)