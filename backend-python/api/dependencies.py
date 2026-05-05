from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY_NAME = 'DotNet-API-KEY'
api_key_header = APIKeyHeader(name = API_KEY_NAME, auto_error = False)

async def verify_api_key(api_key_header: str = Security(api_key_header)):
    expected_api_key = os.getenv("API_KEY")
    if api_key_header != expected_api_key:
        raise HTTPException(status_code = 401, detail = 'Invalid API Key')




