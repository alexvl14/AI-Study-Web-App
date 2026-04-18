from fastapi import FastAPI
from api import convert

app = FastAPI()

app.include_router(convert.router)

@app.get("/test")
def root():
    return {"response": "test"}