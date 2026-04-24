from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List

router = APIRouter()

class EmbedRequest(BaseModel):
    texts: List[str]

model = SentenceTransformer("all-MiniLM-L6-v2")
@router.post("/embed")
async def embed(request: EmbedRequest):
    try:
        vectors = model.encode(request.texts).tolist()
        return {"embeddings": vectors}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))