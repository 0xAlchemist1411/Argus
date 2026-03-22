# Argus 🔍

**AI-powered codebase explorer** — Clone GitHub repositories, index them with semantic search, and ask natural language questions about your code.

![Argus](https://img.shields.io/badge/Stack-Next.js_TypeScript_Fastify-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

Argus is an intelligent code analysis platform that combines modern web technologies with AI to make codebase exploration effortless. Upload any GitHub repository and interact with it conversationally using AI-powered semantic search.

### Key Features

- 🚀 **Repository Ingestion** — Clone and automatically index GitHub repositories
- 💬 **AI Chat Interface** — Ask questions about your codebase and get contextual answers
- 🔍 **Semantic Search** — Vector-based code search using OpenAI embeddings
- 🏗️ **Symbol Extraction** — Automatically identify functions, classes, and code structures
- 📄 **Code Explanation** — Get AI-generated explanations for files and functions
- 📊 **Auto Summarization** — Generate intelligent repository overviews

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│         React UI + TanStack Query + Tailwind CSS            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────────────┐
│                  Backend API (Fastify)                      │
│  Routes: Chat, Search, Explain, Symbol, File, Ingest        │
└────────────────────────┬────────────────────────────────────┘
         ┌──────────────-┼──────────────-┐
         │               │               │
    ┌────▼──────┐  ┌─────▼─────┐   ┌─────▼───┐
    │ PostgreSQL│  │   Redis   │   │  OpenAI │
    │ + pgvector│  │  + BullMQ │   │   API   │
    └──────────-┘  └───────────┘   └─────────┘
```

### Tech Stack

**Backend:**

- Runtime: [Bun](https://bun.sh) — Fast JavaScript runtime
- Framework: [Fastify](https://fastify.io) — Lightweight web server
- ORM: [Prisma](https://www.prisma.io) — Database access
- Language: TypeScript
- Queue: [BullMQ](https://docs.bullmq.io) + Redis for background jobs
- AI: OpenAI API for embeddings and chat

**Frontend:**

- Framework: [Next.js 16](https://nextjs.org) (React 19)
- State: [TanStack Query](https://tanstack.com/query)
- Styling: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- HTTP: Axios

**Database:**

- PostgreSQL with [pgvector](https://github.com/pgvector/pgvector) for embeddings
- Prisma migrations for schema management

---

## Project Structure

```
Argus/
├── backend/                # Node.js/Bun backend
│   ├── src/
│   │   ├── api/           # API routes (chat, repo, search, etc.)
│   │   ├── services/      # Business logic (embedding, search, chat, etc.)
│   │   ├── workers/       # Background job processors
│   │   ├── db/            # Database setup
│   │   ├── queue/         # Job queue configuration
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utilities
│   ├── prisma/            # Database schema & migrations
│   ├── docker-compose.yml # PostgreSQL + Redis setup
│   └── package.json
│
├── frontend/              # Next.js frontend
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Home page
│   │   └── repo/[id]/    # Repository detail page
│   ├── components/       # React components
│   │   ├── ChatPanel.tsx
│   │   ├── FileTree.tsx
│   │   ├── CodeViewer.tsx
│   │   └── ui/           # shadcn UI components
│   ├── lib/              # Utilities & API client
│   └── package.json
│
└── repos/                 # Nested projects
    ├── cpi-contract/     # Rust contracts + TypeScript client
    └── x402-agent/       # Additional agent project
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 20+)
- Docker & Docker Compose
- OpenAI API key
- PostgreSQL (or use Docker Compose)
- Redis (or use Docker Compose)

### 1. Setup Environment

Clone the repository:

```bash
git clone https://github.com/yourusername/argus.git
cd Argus
```

Create `.env` in the `backend` directory:

```bash
cd backend
cat > .env << EOF
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/argus"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="your-openai-api-key"
EOF
```

### 2. Start Database & Redis

```bash
cd backend
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

### 3. Install Dependencies & Setup Database

**Backend:**

```bash
cd backend
bun install
bunx prisma migrate deploy
```

**Frontend:**

```bash
cd frontend
npm install
# or
bun install
```

### 4. Run Development Servers

**Backend (in separate terminal):**

```bash
cd backend
bun run dev  # Starts both server and worker
```

**Frontend (in another terminal):**

```bash
cd frontend
npm run dev
# or
bun run dev
```

- Backend API: http://localhost:4000
- Frontend: http://localhost:3000

---

## API Routes

### Repository Management

- `POST /repos/ingest` — Start indexing a repository
- `GET /repo/:repoId/files` — List indexed files
- `GET /repo/:repoId/summary` — Get repository summary

### Chat & Search

- `POST /chat` — Ask a question about the codebase
- `GET /file` — Get file content
- `GET /symbols` — Search for symbols (functions/classes)

### Explanation

- `POST /explain/file` — Get AI explanation for a file
- `POST /explain/function` — Get AI explanation for a function

---

## How It Works

### 1. Repository Ingestion

```
User uploads repo URL
       ↓
Job queued in Redis (BullMQ)
       ↓
Worker clones repository
       ↓
Scanner walks file tree
       ↓
For each code file:
  - Extract symbols (functions/classes)
  - Split code into chunks
  - Create embeddings with OpenAI
  - Store in PostgreSQL with pgvector
       ↓
Generate repository summary with AI
```

### 2. Semantic Search & Chat

```
User asks question
       ↓
Query converted to embedding
       ↓
Vector similarity search in pgvector
       ↓
Top 5 matching code chunks retrieved
       ↓
Context + question sent to GPT-4o-mini
       ↓
AI generates answer with source citations
```

### 3. Symbol Extraction

Regex patterns identify:

- **Functions:** `function functionName() {}`
- **Classes:** `class ClassName {}`
- Line numbers tracked for quick navigation

---

## Database Schema

### Models

- **Repository** — Metadata about indexed repos (URL, name, summary)
- **File** — Code files within repositories (path, embedding)
- **Chunk** — Code segments split for embedding (content, embedding, fileId)
- **Symbol** — Extracted functions/classes (name, type, line number)

See [prisma/schema.prisma](backend/prisma/schema.prisma) for full schema.

---

## Configuration

### Environment Variables

**Backend (.env):**

```env
PORT=4000                                                    # API port
DATABASE_URL=postgresql://user:pass@localhost:5432/argus    # PostgreSQL connection
REDIS_URL=redis://localhost:6379                            # Redis connection
OPENAI_API_KEY=sk-...                                       # OpenAI API key
```

### OpenAI Models Used

- `text-embedding-3-small` — Vector embeddings (4096-dimensional)
- `gpt-4o-mini` — Chat completions and explanations

---

## Development

### Running Tests

```bash
cd backend
bun test
```

### Database Migrations

Create a new migration after schema changes:

```bash
cd backend
bunx prisma migrate dev --name description_of_change
```

View data with Prisma Studio:

```bash
bunx prisma studio
```

### Code Quality

```bash
cd frontend
npm run lint

cd backend
bunx eslint src/
```

---

## Performance Considerations

- **Embeddings:** Cached in database (pgvector)
- **Concurrency:** Code chunking uses p-limit (5 parallel requests)
- **Vector Search:** Native PostgreSQL similarity search with pgvector
- **Job Processing:** Background workers decouple indexing from API
- **Frontend:** TanStack Query for efficient data fetching and caching

---

## Known Limitations

- File read operations limited to code files (configurable in utils)
- Repository size impacts indexing time
- OpenAI API costs scale with repository size
- Embeddings maximum token length: ~8000 tokens

---

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs db
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
```

### OpenAI API Errors

- Verify API key in `.env`
- Check account has sufficient credits
- Review rate limits at platform.openai.com

### Worker Not Processing Jobs

```bash
# Restart worker and server together
cd backend
bun run dev
```

---

## Future Roadmap

- [ ] Support for private repositories (SSH keys)
- [ ] Multi-language code analysis
- [ ] Graph-based code dependencies
- [ ] Code review automation
- [ ] Team collaboration features
- [ ] Self-hosted LLM support

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation in `backend/README.md` and `frontend/README.md`

---

**Made by Alchemist** 🚀
