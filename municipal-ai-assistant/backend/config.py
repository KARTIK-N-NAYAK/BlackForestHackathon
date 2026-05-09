"""
Configuration for the Municipal AI Assistant.
All settings are kept local – no external API calls.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env", override=False)

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
KNOWLEDGE_BASE_DIR = DATA_DIR / "knowledge_base"
ADDITIONAL_DOCS_DIR = DATA_DIR / "additional_documents"
TEMPLATES_DIR       = DATA_DIR / "templates"
UPLOADS_DIR         = DATA_DIR / "uploads"
CHROMA_DIR          = DATA_DIR / "chroma_db"
FILLED_OUTPUT_DIR   = DATA_DIR / "filled_templates"

for _d in [KNOWLEDGE_BASE_DIR, ADDITIONAL_DOCS_DIR, TEMPLATES_DIR,
           UPLOADS_DIR, CHROMA_DIR, FILLED_OUTPUT_DIR]:
    _d.mkdir(parents=True, exist_ok=True)

# ── Ollama / LLM ─────────────────────────────────────────────────────────────
OLLAMA_BASE_URL   = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
CHAT_MODEL        = os.getenv("CHAT_MODEL",       "mistral")          # local Mistral
EMBEDDING_MODEL   = os.getenv("EMBEDDING_MODEL",  "nomic-embed-text") # local embeddings

# ── RAG / Retrieval ───────────────────────────────────────────────────────────
CHUNK_SIZE           = 800    # characters per chunk
CHUNK_OVERLAP        = 150
TOP_K_RETRIEVAL      = 6      # chunks retrieved per query
MIN_RELEVANCE_SCORE  = 0.30   # below this → "Ich weiß es nicht"
LLM_TEMPERATURE      = 0.0    # deterministic – anti-hallucination

# ── ChromaDB collection names ─────────────────────────────────────────────────
COLLECTION_KB    = "knowledge_base"
COLLECTION_EXTRA = "additional_documents"

# ── CORS (frontend dev server) ────────────────────────────────────────────────
CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
