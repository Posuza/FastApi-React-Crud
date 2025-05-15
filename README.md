# GutsApi Project

## Setup

### Backend
```bash
cd backEnd
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

```bash
# Backend
cd backEnd
uvicorn main:app --reload
```

### Frontend
```bash
cd frontEnd
npm install
```


```bash
# Frontend
cd frontEnd
npm run dev
```



2. Add a `.env.example` file in both backend and frontend directories to document required environment variables.

This structure:
- Separates concerns between frontend and backend
- Properly ignores environment-specific files
- Makes it easy for other developers to set up the project
- Keeps sensitive information out of version control2. Add a `.env.example` file in both backend and frontend directories to document required environment variables.

This structure:
- Separates concerns between frontend and backend
- Properly ignores environment-specific files
- Makes it easy for other developers to set up the project
- Keeps sensitive information out of version control