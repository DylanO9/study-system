from fastapi import FastAPI

app = FastAPI() # Server instantiation

@app.get("/")

def home():
    return {"message": "Welcome to the Randomizer API"}