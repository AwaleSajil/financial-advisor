---
title: Rags2Riches
emoji: 💰
colorFrom: purple
colorTo: indigo
sdk: docker
pinned: false
license: apache-2.0
short_description: Where did my money go? Chat with your bank statements
app_port: 7860
---
# Rags2Riches - Personal Finance Transaction Analysis

AI-powered financial transaction analysis using RAG (Retrieval-Augmented Generation) with Model Context Protocol (MCP) integration. Upload your bank statements and chat with your financial data.

## Features

- **Smart CSV Ingestion**: Automatically maps any CSV format to standardized transaction schema using LLM
- **Multi-Provider Support**: Works with Google Gemini and OpenAI models
- **Merchant Enrichment**: Automatically enriches transactions with web-searched merchant information
- **Semantic + Structured Search**: Actian Vector DB for semantic search + Databricks SQL for structured queries
- **MCP Integration**: Leverages Model Context Protocol for tool-based agent interactions
- **Mobile-First UI**: Expo (React Native) frontend with Android support
- **Auth**: Supabase authentication with JWT validation
- **Streaming Chat**: Server-Sent Events (SSE) for real-time AI responses

## Architecture

- **Frontend**: Expo (React Native Web) - serves as static build in production
- **Backend**: FastAPI wrapping the RAG engine
- **RAG Engine**: LangChain + LangGraph with MCP tool server
- **Auth**: Supabase (client-side JS + server-side JWT validation)
- **Vector DB**: Actian Vector DB for semantic search (multi-tenant via user_id). Qdrant Cloud available as an alternative.
- **Database**: Databricks SQL Warehouse for structured transaction queries. Supabase PostgreSQL available as an alternative.

  <img width="900" height="594" alt="architecture" src="https://github.com/user-attachments/assets/f432c094-dc59-4046-aee6-607e278d3917" />


## Environment Variables

Set these as **Repository secrets** in HF Space settings:

### Required

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL (auth) |
| `SUPABASE_KEY` | Supabase anon/service key (auth) |

### Databricks (Primary SQL Database)

| Variable | Description |
|---|---|
| `POSTGRESSQL_STACK` | Set to `databricks` |
| `DATABRICKS_SERVER_HOSTNAME` | Databricks workspace hostname |
| `DATABRICKS_HTTP_PATH` | SQL Warehouse HTTP path |
| `DATABRICKS_TOKEN` | Databricks personal access token |

### Actian Vector DB (Primary Vector Store)

| Variable | Description |
|---|---|
| `VECTOR_DB_STACK` | Set to `actian` |
| `ACTIAN_ADDRESS` | Actian Vector DB endpoint |
| `ACTIAN_API_KEY` | Actian API key |

### Alternative Backends

| Variable | Description |
|---|---|
| `POSTGRESSQL_STACK` | Set to `supabase` to use Supabase PostgreSQL instead of Databricks |
| `DATABASE_URL` | PostgreSQL connection string (when using Supabase) |
| `VECTOR_DB_STACK` | Set to `qdrant` to use Qdrant Cloud instead of Actian |
| `QDRANT_URL` | Qdrant Cloud cluster URL (when using Qdrant) |
| `QDRANT_API_KEY` | Qdrant API key (when using Qdrant) |

## Deployment

### Two-Space Deployment (HF Spaces)

The application is deployed as two separate Hugging Face Spaces:

- **Backend** ([rags2riches-backend](https://huggingface.co/spaces/ksmu/rags2riches-backend)): FastAPI server with RAG engine
- **Frontend** ([rags2riches-frontend](https://huggingface.co/spaces/ksmu/rags2riches-frontend)): Expo web static build

The frontend Space requires one build secret:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend Space URL, e.g. `https://ksmu-rags2riches-backend.hf.space/api/v1` |

### Single-Container Deployment

```bash
docker build -t r2r .
docker run -p 7860:7860 --env-file .env r2r
```
Open http://localhost:7860

### Docker Compose (Separate Containers)

```bash
docker compose build
docker compose up -d
```
- Backend: http://localhost:7860
- Frontend: http://localhost:8081

## Local Development

### Backend
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

## Usage

1. Register/login with your email
2. Configure your LLM provider and API key in Settings
3. Upload CSV transaction files via the Ingest tab
4. Chat with your financial data

### Example Questions

- "How much did I spend on restaurants last month?"
- "What are my top 5 spending categories?"
- "Show me all transactions over $100"
- "Analyze my spending patterns"

## Supported CSV Formats

MoneyRAG automatically handles different CSV formats:
- Chase Bank, Discover, and custom formats
- LLM-based column mapping (works with any column names)
- Required: Date, Merchant/Description, Amount

## Technologies

- **LangChain & LangGraph**: Agent orchestration
- **Google Gemini / OpenAI GPT**: LLM providers
- **Actian Vector DB**: Vector database for semantic search
- **Databricks SQL**: Structured transaction queries
- **Supabase**: Auth + alternative PostgreSQL database
- **Qdrant Cloud**: Alternative vector database
- **FastMCP**: Model Context Protocol server
- **Expo (React Native)**: Cross-platform frontend
- **FastAPI**: Backend API framework

## Contributors

- **Sajil Awale** - [GitHub](https://github.com/AwaleSajil)
- **Simran KC** - [GitHub](https://github.com/iamsims)

## License

MIT
