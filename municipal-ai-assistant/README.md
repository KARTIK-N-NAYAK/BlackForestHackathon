# 🏛️ Kommunaler KI-Assistent – Energiewende

Ein vollständig lokaler KI-Assistent für deutsche Kommunalverwaltungen zur Unterstützung
bei der Energiewende und kommunalen Wärmeplanung.

## ✨ Funktionen

| Feature | Beschreibung |
|---|---|
| **Chat mit Quellenangabe** | Stellt Fragen zu Gesetzen, Verträgen und Plänen – mit exakter Zitierung (Dokument, Seite, Textauszug) |
| **„Ich weiß es nicht"** | Halluziniert nicht – fragt nach mehr Kontext wenn nötig |
| **Wissensbasis-Dashboard** | Dokumente hochladen, anzeigen, löschen und neu indizieren |
| **Vorlagen ausfüllen** | Excel, Word und PDF-Formulare halbautomatisch befüllen mit KI-Vorschlägen |
| **100% lokal** | Kein Cloud-Dienst – alle Daten bleiben im Haus (DSGVO-konform) |

## 🏗️ Architektur

```
Frontend (React + Vite)  ←→  FastAPI Backend  ←→  Ollama (Mistral lokal)
                                    ↓
                               ChromaDB (lokal)
                          (Vektordatenbank für RAG)
```

- **LLM**: Mistral 7B via [Ollama](https://ollama.com) (lokal)
- **Embeddings**: nomic-embed-text via Ollama (lokal)
- **RAG**: LangChain + LangGraph
- **Vektordatenbank**: ChromaDB (persistent auf Disk)
- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite + TypeScript

## 🚀 Setup (ohne Docker)

### Voraussetzungen
- Python 3.11+
- Node.js 20+
- [Ollama](https://ollama.com/download) installiert

### Schritt 1: Ollama & Modelle herunterladen

```bash
# Ollama starten (falls nicht als Service)
ollama serve

# In einem neuen Terminal:
ollama pull mistral          # Chat-Modell (~4 GB)
ollama pull nomic-embed-text # Embedding-Modell (~270 MB)
```

### Schritt 2: Python-Umgebung & Backend

```bash
cd municipal-ai-assistant/backend

# Virtuelle Umgebung anlegen
python -m venv .venv

# Aktivieren (Windows)
.venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# Dokumente in Datenverzeichnisse kopieren (optional – beim Start automatisch indiziert)
# backend/data/knowledge_base/     ← Wissensbasis-Dokumente (PDF, DOCX, XLSX)
# backend/data/additional_documents/ ← Zusatzdokumente

# Backend starten
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend läuft auf: http://localhost:8000
API-Dokumentation: http://localhost:8000/docs

### Schritt 3: Frontend

```bash
cd municipal-ai-assistant/frontend

npm install
npm run dev
```

Frontend läuft auf: http://localhost:5173

## 📁 Datenverzeichnisse

```
backend/data/
├── knowledge_base/          ← Wissensbasis (Gesetze, Verträge, Pläne)
├── additional_documents/    ← Zusatzdokumente (Leitfäden, Entwürfe)
├── templates/               ← Vorab-Templates (optional)
├── uploads/                 ← Temporäre Uploads
├── filled_templates/        ← Ausgefüllte Vorlagen (Export)
└── chroma_db/               ← Vektordatenbank (automatisch generiert)
```

## 🔧 Konfiguration

Umgebungsvariablen in `backend/.env` (optional):

```env
OLLAMA_BASE_URL=http://localhost:11434
CHAT_MODEL=mistral
EMBEDDING_MODEL=nomic-embed-text
```

Für bessere Deutschen-Sprachunterstützung alternativ:
```env
CHAT_MODEL=mistral-nemo  # Größer aber besseres Deutsch
```

## 📋 Schnellstart mit Hackathon-Dokumenten

```bash
# Windows PowerShell
cd d:\BlackForestHackathon
.\setup_data.ps1
```

Das Skript kopiert alle bereitgestellten Dokumente automatisch in die richtigen Verzeichnisse.

## 🛡️ Datenschutz

- Alle Anfragen bleiben auf dem lokalen Rechner
- Keine Verbindungen zu externen KI-APIs
- ChromaDB speichert Vektoren lokal auf Disk
- Ollama läuft vollständig offline nach dem initialen Download

## 🏆 Hackathon – Success Criteria

| Kriterium | Umsetzung |
|---|---|
| Intuitive Nutzung | Einfache Web-Oberfläche, kein Training nötig |
| Genaue & zitierbare Antworten | Jede Aussage mit Dokument + Seite + Textzitat |
| Unsicherheiten transparent | „ICH WEISS ES NICHT" + Erklärung was fehlt |
| Inhalt aus Nutzer-Dokumenten | Separate Kollektion für Zusatzdokumente |
| Vorlagen ausfüllen | Halbautomatisch mit KI-Vorschlägen + manuelle Korrektur |
| Arbeitsentlastung | Direkte Extraktion aus Dokumenten statt manuelle Recherche |
