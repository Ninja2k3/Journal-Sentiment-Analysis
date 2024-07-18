from flask import Flask,render_template,Response,request,redirect,url_for,flash
import google.generativeai as genai
from flask_cors import CORS
from flask_pymongo import PyMongo
import datetime;
from bson.objectid import ObjectId

genai.configure(api_key="AIzaSyAX6mH3YvfK9ODjOiulTCu3W5FAFQHk4DM")
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = Flask(__name__)
CORS(app)
app.secret_key = '_5#y2LF4Q8zxec/'
app.config["MONGO_URI"] = "mongodb://localhost:27017/journal"
mongo = PyMongo(app)



@app.route("/analysis/<id>",methods=['GET','POST'])
def login(id):
    if request.method=='GET':
        if not mongo.db.analysis.find_one({"_id":ObjectId(id)}):
            entry = mongo.db.backend.find_one({"_id":ObjectId(id)})
            s = entry["Entry"]
            x = s.split('.')
            x.pop()
            response = model.generate_content("Return a list as response where each element of the list is a sentiment analysis score between -1 and 1 for the corresponding sentence in this given list, the output should just be a list of decimals. : {}".format(x))
            text = response.text[1:len(response.text)-1].split(', ')
            mongo.db.analysis.insert_one({"_id":ObjectId(id),"anscore":text,"s":x})
            return {'anscore':text,'s':x}
        else:
            entry = mongo.db.analysis.find_one({"_id":ObjectId(id)})
            return {'anscore':entry["anscore"],'s':entry["s"]}
            
            
    else:
        entry = mongo.db.backend.find_one({"_id":ObjectId(id)})
        s = entry["Entry"]
        x = s.split('.')
        x.pop()
        response = model.generate_content("Return a list as response where each element of the list is a sentiment analysis score between -1 and 1 for the corresponding sentence in this given list : {}".format(x))
        text = response.text[1:len(response.text)-1].split(', ')
        return {'anscore':text}

@app.route("/create",methods=['GET','POST'])
def create():
    if request.method=='POST':
        s = request.form.get('string')
        ct = datetime.datetime.now()
        title = request.form.get('title')
        mongo.db.backend.insert_one({'Title':title,'Entry':s,'Timestamp':ct})
        return {'Title':title,'Entry':s,'Timestamp':ct}

@app.route("/home",methods=['GET','POST'])
def home():
    if request.method=='GET':
        entries = mongo.db.backend.find()
        e = []
        for entry in entries:
            e.append((entry["Title"],str(entry["_id"]),entry["Timestamp"]))
        return {'entries':e}