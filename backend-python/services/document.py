import subprocess
import os
from pypdf import PdfReader

def convert_to_pdf_and_extract_text(file_path, output_dir):

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

        reader = PdfReader(pdf_path)
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text()
        return pdf_path, extracted_text
    except subprocess.CalledProcessError as e:
        raise Exception(f"LibreOffice failed to convert the file to pdf: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")