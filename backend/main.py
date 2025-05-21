from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model globally
generator = None

@app.on_event("startup")
def load_model():
    global generator
    generator = pipeline("text-generation", model="sshleifer/tiny-gpt2")
    generator("Hello", max_length=5)  # optional warmup

@app.get("/")
async def root():
    return {"message": "Backend is running!"}

@app.post("/generate")
async def generate_text(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    result = generator(prompt, max_length=100, num_return_sequences=1)
    return {"generated_text": result[0]["generated_text"]}
