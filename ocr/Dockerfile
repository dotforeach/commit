# OCR propio para facturas (RapidOCR = modelos de PaddleOCR sobre ONNX Runtime; funciona en x86 y ARM).
# Con este servicio, a la IA le llega el texto de la factura, no la foto.
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
# Usuario sin privilegios con home (caché de modelos).
RUN useradd --create-home --uid 10001 ocr && chown -R ocr /usr/local/lib/python3.12/site-packages/rapidocr
USER ocr
# Descarga/carga los modelos al construir la imagen (el contenedor no necesita internet al arrancar).
RUN python -c "from rapidocr import RapidOCR; RapidOCR()"
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
