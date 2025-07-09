from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from gramformer import Gramformer
from pydantic import BaseModel

gf = Gramformer(models=1)  # 1 = Corrector

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

class TextIn(BaseModel):
    text: str

@app.get("/", response_class=HTMLResponse)
def read_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "result": None})

@app.post("/correct-ui", response_class=HTMLResponse)
async def correct_text_ui(request: Request, text: str = Form(...)):
    try:
        corrections = list(gf.correct(input.text))
        corrected = corrections[0] if corrections else "No correction could be made."

    except:
        corrected = "Correction failed"
    return templates.TemplateResponse("index.html", {"request": request, "result": corrected, "original": text})

@app.post("/api/correct", response_class=JSONResponse)
async def correct_api(input: TextIn):
    try:
        corrected = list(gf.correct(input.text))[0]
        return {"corrected_text": corrected}
    except Exception as e:
        return {"error": str(e)}
