import subprocess
import os
from pyxtxt import xtxt

def extract_txt(file_path) -> str:
    return xtxt(file_path)

def convert_to_pdf(file_path, output_dir):
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
        return os.path.join(output_dir, f"{base_name}.pdf")
    except subprocess.CalledProcessError as e:
        raise Exception(f"LibreOffice failed to convert the file to pdf: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")