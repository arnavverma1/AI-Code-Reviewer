from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import openai
import os

app = FastAPI()

# Load API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key not found. Set OPENAI_API_KEY as an environment variable.")

openai.api_key = OPENAI_API_KEY

@app.post("/analyze/")
async def analyze_code(file: UploadFile = File(...)):
    """
    Endpoint to receive a code file and return AI-generated feedback.
    """
    try:
        # Read file contents
        content = await file.read()
        code = content.decode("utf-8")

        # AI-powered code analysis
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are an expert software engineer providing in-depth code reviews."},
                {"role": "user", "content": f"Review the following code:\n\n{code}\n\nProvide structured feedback."}
            ]
        )

        # Extract AI response
        feedback = response["choices"][0]["message"]["content"]

        return JSONResponse(content={"feedback": feedback})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
