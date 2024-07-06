from flask import Flask,render_template,Response,request,redirect,url_for,flash
import google.generativeai as genai
from flask_cors import CORS
from flask_pymongo import PyMongo



genai.configure(api_key="AIzaSyAX6mH3YvfK9ODjOiulTCu3W5FAFQHk4DM")
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = Flask(__name__)
CORS(app)
app.secret_key = '_5#y2LF4Q8zxec/'
app.config["MONGO_URI"] = "mongodb://localhost:27017/journal"
mongo = PyMongo(app)



@app.route("/",methods=['GET','POST'])
def hello_world():
    if request.method=='GET':
        #response = model.generate_content("Write a story about a AI and magic")
        response = {'text':'text'}
        print(response['text'])
        return response
    else:
        s = request.form.get('string')
        x = s.split('.')
        x.pop()
        response = model.generate_content("Return a list as response where each element of the list is a sentiment analysis score between -1 and 1 for the corresponding sentence in this given list : {}".format(x))
        text = response.text[1:len(response.text)-1].split(', ')
        mongo.db.backend.insert_one({'test':1})
        return {'anscore':text}

