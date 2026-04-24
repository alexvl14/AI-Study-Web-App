from fastapi import FastAPI
from api import convert, embed

app = FastAPI()

app.include_router(convert.router)
app.include_router(embed.router)

@app.get("/test")
def root():
    return {"response": "test"}