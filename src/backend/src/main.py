from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def load_prompt(path: str, values: dict[str, str]) -> str:
    prompt = Path(path).read_text()

    for key, value in values.items():
        prompt = prompt.replace(f"{{{{{key}}}}}", value)

    return prompt


class Notes(BaseModel):
    notes: str


class QuestionResponse(BaseModel):
    questions: list[str]


class EvaluateRequest(BaseModel):
    question: str
    reference_content: str
    answer: str


class EvaluationResponse(BaseModel):
    score: int
    covered_concepts: list[str]
    missing_concepts: list[str]
    misconceptions: list[str]
    feedback: str


@app.post("/generate_question")
def generate_question(notes: Notes):
    prompt = load_prompt(
        "./prompts/generate_questions.md",
        {
            "notes": notes.notes
        }
    )

    response = client.responses.parse(
        model="gpt-4.1-mini",
        input=prompt,
        text_format=QuestionResponse
    )

    parsed = response.output_parsed
    return {"questions": parsed.questions}


@app.post("/evaluate_answer")
def evaluate_answer(req: EvaluateRequest):
    prompt = load_prompt(
        "./prompts/evaluate_answer.md",
        {
            "question": req.question,
            "reference_content": req.reference_content,
            "answer": req.answer
        }
    )

    response = client.responses.parse(
        model="gpt-4.1-mini",
        input=prompt,
        text_format=EvaluationResponse
    )

    parsed = response.output_parsed

    return {
        "score": parsed.score,
        "covered_concepts": parsed.covered_concepts,
        "missing_concepts": parsed.missing_concepts,
        "misconceptions": parsed.misconceptions,
        "feedback": parsed.feedback
    }