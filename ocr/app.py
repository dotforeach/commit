"""Servicio de OCR propio (RapidOCR: modelos de PaddleOCR sobre ONNX Runtime). No guarda nada."""
import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from rapidocr import RapidOCR

app = FastAPI(title="Commit OCR")
engine = RapidOCR()

MAX_BYTES = 8 * 1024 * 1024


def _texts(out) -> list[str]:
    """RapidOCR 2+ devuelve un objeto con .txts; versiones anteriores, (resultado, tiempos)."""
    txts = getattr(out, "txts", None)
    if txts is not None:
        return [t for t in txts if t]
    if isinstance(out, tuple) and out and out[0]:
        return [r[1] for r in out[0] if len(r) > 1 and r[1]]
    return []


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
    lines = _texts(engine(image))
    return {"text": "\n".join(lines), "lines": len(lines)}
