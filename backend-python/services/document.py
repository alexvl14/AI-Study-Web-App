import subprocess
import os
import shutil
import uuid

def convert_to_pdf(file_path, output_dir):

    if not os.path.exists(file_path):
        raise FileNotFoundError("File not found!")

    profile_dir = os.path.join(output_dir, f"lo_profile_{uuid.uuid4()}")
    try:
        result = subprocess.run([
            "libreoffice",
            f"-env:UserInstallation=file://{profile_dir}",
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--convert-to",
            "pdf",
            "--outdir",
            output_dir,
            file_path
        ], check=False, capture_output=True, text=True)
        
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        pdf_path = os.path.join(output_dir, f"{base_name}.pdf")
        if not os.path.exists(pdf_path):
            error_details = f"STDOUT: {result.stdout} | STDERR: {result.stderr}"
            raise FileNotFoundError(f"LibreOffice failed to generate PDF! Details: {error_details}")
        return pdf_path
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")
    finally:
        if os.path.exists(profile_dir):
            shutil.rmtree(profile_dir, ignore_errors=True)

