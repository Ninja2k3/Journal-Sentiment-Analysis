from flask import Flask,render_template,Response,request,redirect,url_for,flash
import google.generativeai as genai
from flask_cors import CORS
from flask_pymongo import PyMongo
import datetime;
from bson.objectid import ObjectId
import cv2
from matplotlib.figure import Figure
import base64
from io import BytesIO

genai.configure(api_key=INSERT KEY HERE)
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = Flask(__name__)
CORS(app)
app.secret_key = MONGO KEY
app.config["MONGO_URI"] = MONGO HOST URL
mongo = PyMongo(app)

camera=cv2.VideoCapture(0)
#backends = ["opencv","ssd","dlib","mtcnn","retinaface","mediapipe"]

def generate_frames():
    while True:
            
        ## read the camera frame
        success,frame=camera.read()
        if not success:
            break
        else:
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()

        yield(b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video')
def video():
    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

#@app.route('/')
#def test():
#    face = DeepFace.detectFace("1.jpg",target_size=(224,224),detector_backend="opencv")
#    print(face)
#    return ''

@app.route("/analysis/<id>",methods=['GET','POST'])
def login(id):
    if request.method=='GET':
        entry = mongo.db.analysis.find_one({"_id":ObjectId(id)})
        text = entry["anscore"]
        avg = sum(float(i) for i in text)/len(text)
        return {'anscore':entry["anscore"],'s':entry["s"],'avg':avg}
            
            
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
        entry = {'Title':title,'Entry':s,'Timestamp':ct}
        s = entry["Entry"]
        x = s.split('.')
        x.pop()
        response = model.generate_content("Return a list as response where each element of the list is a sentiment analysis score between -1 and 1 for the corresponding sentence in this given list, the output should just be a list of decimals. : {}".format(x))
        text = response.text[1:len(response.text)-1].split(', ')
        avg = sum(float(i) for i in text)/len(text)
        entry = mongo.db.backend.find_one({'Title':title,'Entry':s,'Timestamp':ct})
        mongo.db.analysis.insert_one({"_id":ObjectId(entry["_id"]),"anscore":text,"s":x,"avg":avg})
        return {'Title':title,'Entry':s,'Timestamp':ct}

@app.route("/home",methods=['GET','POST'])
def home():
    if request.method=='GET':
        entries = mongo.db.backend.find()
        e = []
        for entry in entries:
            avg = mongo.db.analysis.find_one({"_id":entry["_id"]})['avg']
            e.append((entry["Title"],str(entry["_id"]),entry["Timestamp"],avg))
        return {'entries':e}

@app.route("/plot",methods=['GET'])
def plot():
    if request.method=='GET':
        entries = mongo.db.backend.find()
        timestamps = []
        averages = []
        for entry in entries:
            avg = mongo.db.analysis.find_one({"_id":entry["_id"]})['avg']
            timestamps.append(entry["Timestamp"])
            averages.append(avg)
        fig = Figure(figsize=(12, 7), dpi=80)
        ax = fig.subplots()
        ax.plot(timestamps,averages)
        # Save it to a temporary buffer.
        buf = BytesIO()
        fig.savefig(buf, format="png")
        # Embed the result in the html output.
        data = base64.b64encode(buf.getbuffer()).decode("ascii")
        return {'img':data}
        #return f"<img src='data:image/png;base64,{data}'/>"
    
