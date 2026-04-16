import subprocess
import os
from pyxtxt import xtxt

def extract_text(file_path) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError("File not found!")
    return xtxt(file_path)

def convert_to_pdf(file_path, output_dir) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError("File not found!")
    try:
        subprocess.run([
            "libreoffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            output_dir,
            file_path
        ], check=True)
        
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        pdf_path = os.path.join(output_dir, f"{base_name}.pdf")
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"LibreOffice convertion appered successful, but {pdf_path} was not found!")
        return pdf_path
    except subprocess.CalledProcessError as e:
        raise Exception(f"LibreOffice failed to convert the file to pdf: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")