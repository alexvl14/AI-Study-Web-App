from fastapi import Depends
from fastapi import FastAPI
from api import convert, embed
from api.dependencies import verify_api_key

app = FastAPI(dependencies=[Depends(verify_api_key)])

app.include_router(convert.router)
app.include_router(embed.router)

@app.get("/test")
def root():
    return {"response": "test"}