from fastapi import APIRouter, UploadFile, File,HTTPException
import shutil
import os
import uuid
import tempfile
import base64
from services.document import convert_to_pdf_and_extract_text

router = APIRouter()


@router.post("/extract-text-pdf")
async def extract_text_convert_to_pdf(file:UploadFile = File(...)):
    temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{file.filename}")
    result_dir = tempfile.gettempdir()
    pdf_path = None                        
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        pdf_path,extracted_text = convert_to_pdf_and_extract_text(temp_path, result_dir)

        with open(pdf_path, "rb") as f:
            encoded_pdf = base64.b64encode(f.read()).decode('utf-8')

        return {
            "text" : extracted_text,
            "pdfBase64" : encoded_pdf
        }
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)

    
        


