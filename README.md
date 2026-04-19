# Study Platform

## Why did I build this?
I've been doing self-studying for a couple of months, and I found myself being slightly inconvienienced with tracking notes, resources, learning progress, determining what I must review, and so I've decided to build a project around solving this problem!

Also, I've learned lots from my own personal self-study journey in terms of effective ways to study, and I will be incorporating those in the design of this project.

## Summary
This platform is a unified place to track study materials, notes, time, and it can provide insights based on the notes you wrote during the session and create assessment material to make sure you have internalized it.

**Demo Video:**  
**Site:**
## Features
- User login/signup
- Create, read, update, delete subjects and topics to study
- Initiate and terminate a study session and include notes + resouces used during that session
- View the notes accumulated overtime in a sorted order
- Create, read, delete insights on weakness points on a subject or topic
- Create, read, delete assesments made for a subject, topic or from a study session -> can retake
- Dashboard visualizes consistency of study amount, weak spots and progress of how much information you can retain within a certain period of time

## Technologies
- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Python, FastAPI, Pydantic
- **Database**: PostgreSQL, Amazon RDS, pgvector
- **Cache/Queue**: Redis + Celery
- **Storage**: Amazon S3
- **LLM**: OpenAI
- **OCR**: Google Cloud Vision
- **Infra**: Docker, Render