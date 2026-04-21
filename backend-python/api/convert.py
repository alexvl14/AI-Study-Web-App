from fastapi import APIRouter, UploadFile, File,HTTPException
import shutil
import os
import uuid
import tempfile
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from services.document import convert_to_pdf

router = APIRouter()


@router.post("/parse_to_pdf")
async def parse_to_pdf(file:UploadFile = File(...)):
    temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{file.filename}")
    result_dir = tempfile.gettempdir()
    pdf_path = None                        
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        pdf_path = convert_to_pdf(temp_path, result_dir)

        def cleanup():
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
            if pdf_path and os.path.exists(pdf_path):
                os.remove(pdf_path)

        return FileResponse(
            pdf_path, 
            media_type="application/pdf", 
            filename=os.path.basename(pdf_path),
            background=BackgroundTask(cleanup)
        )
    except Exception as ex:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        if pdf_path and os.path.exists(pdf_path):
            os.remove(pdf_path)
        raise HTTPException(status_code=500, detail=str(ex))

    
        


