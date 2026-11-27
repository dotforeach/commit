"""Servicio de OCR propio (PaddleOCR). Recibe una imagen y devuelve el texto. No guarda nada."""
import numpy as np
import cv2
from fastapi import FastAPI, HTTPException, Request
from paddleocr import PaddleOCR

app = FastAPI(title="Commit OCR")
# Modelo latino (incluye español). Sin corrección de orientación de documento: son fotos de recibos.
ocr = PaddleOCR(lang="es", use_doc_orientation_classify=False, use_doc_unwarping=False, use_textline_orientation=True)

MAX_BYTES = 8 * 1024 * 1024


def _texts(result) -> list[str]:
    lines: list[str] = []
    for page in result or []:
        data = page if isinstance(page, dict) else getattr(page, "json", {}).get("res", {})
        lines.extend(t for t in (data.get("rec_texts") or []) if t)
    return lines


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/ocr")
async def read(request: Request):
    body = await request.body()
    if not body or len(body) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="Imagen vacía o demasiado grande")
    image = cv2.imdecode(np.frombuffer(body, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="No es una imagen válida")
    lines = _texts(ocr.predict(image))
    return {"text": "\n".join(lines), "lines": len(lines)}
