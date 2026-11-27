# OCR propio para facturas: la imagen no sale del servidor hacia el proveedor de IA.
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 libgomp1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
# Descarga los modelos al construir la imagen (así el contenedor no necesita internet al arrancar).
RUN python -c "from paddleocr import PaddleOCR; PaddleOCR(lang='es', use_doc_orientation_classify=False, use_doc_unwarping=False, use_textline_orientation=True)"
EXPOSE 8000
USER nobody
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
