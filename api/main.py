import os
import pymongo
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


client = pymongo.MongoClient(os.getenv("MONGODB_URL"))
urls = client[os.getenv("MONGODB_CLUSTER")][os.getenv("MONGODB_COLLECTION")]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

messages = {
    "unknown": "An unknown error occured!",
    "taken": "That URL is taken!",
    "nonexistent": "That URL does not exist!",
    "success": "Successfully created!",
}


class Data(BaseModel):
    longform: str
    shortform: str


@app.get("/")
async def home():
    return RedirectResponse("https://create.ycml.ml/", status_code=301)


@app.post("/create")
async def create(data: Data):
    if urls.find_one({"shortform": data.shortform}):  # Check if URL is taken
        return {"success": False, "message": messages["taken"]}

    insert = urls.insert_one({"shortform": data.shortform, "longform": data.longform})

    if not insert.acknowledged:  # Check if inserted
        return {"success": False, "message": messages["unknown"]}

    return {"success": True, "message": messages["success"]}


@app.get("/{shortform}")
async def get(shortform: str):
    result = urls.find_one({"shortform": shortform})

    if not result:  # Link does not exist
        return {"success": False, "message": messages["nonexistent"]}

    return RedirectResponse(result["longform"])
