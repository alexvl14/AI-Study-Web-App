# StudyLM Python AI Service 🧠

This microservice handles the heavy-lifting AI tasks for StudyLM, such as document processing, text extraction, and vector embedding generation.

## 🛠️ Tech Stack
- **Framework:** FastAPI
- **NLP:** Sentence Transformers (`all-MiniLM-L6-v2`)
- **Document Processing:** Custom Python logic for PDF/Text handling.

## 📂 API Reference

This service is internal and requires an `X-API-KEY` header for authentication, matching the key configured in the .NET backend.

### 📄 Document Conversion
- **POST `/parse_to_pdf`**
  - Converts various document formats into a standardized PDF and extracts text.
  - Body: `multipart/form-data` with `file`.
  - Returns: A processed PDF file.

### 🔢 Embeddings
- **POST `/embed`**
  - Generates vector embeddings for the provided text segments.
  - Body:
    ```json
    {
      "texts": ["text segment 1", "text segment 2"]
    }
    ```
  - Returns: A list of float vectors.

## ⚙️ Configuration
Create a `.env` file in this directory:
- `API_KEY`: The shared secret matching the .NET backend's configuration.
- `GEMINI_API_KEY`: (If utilized for direct Python-based LLM tasks).

## 🚀 Running Locally
```bash
pip install -r requirements.txt
python main.py
```
Default port: `8000`
