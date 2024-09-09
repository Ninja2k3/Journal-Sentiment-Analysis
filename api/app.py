from flask import Flask,render_template,Response,request,redirect,url_for,flash,session, jsonify
import google.generativeai as genai
from flask_cors import CORS
from flask_pymongo import PyMongo
import datetime;
from bson.objectid import ObjectId
import cv2
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import base64
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from io import BytesIO

genai.configure(api_key=YOUR_API_KEY)s
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])


app = Flask(__name__)
CORS(app)
app.secret_key = '_5#y2LF4Q8zxec/'
app.config["MONGO_URI"] = "mongodb://localhost:27017/journal"
mongo = PyMongo(app)
users=mongo.db.users

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
#def video():
#    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

#@app.route('/')
#def test():
#    face = DeepFace.detectFace("1.jpg",target_size=(224,224),detector_backend="opencv")
#    print(face)
#    return ''

@app.route("/register", methods=['GET','POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        existing_user = users.find_one({'username': username})
        if existing_user is None:
            hashed_password = generate_password_hash(password, method='scrypt')
            users.insert_one({'username': username, 'password': hashed_password})
            flash('You have successfully registered!', 'success')
            return redirect(url_for('login'))
        else:
            flash('Username already exists!', 'danger')
    
    return render_template('register.html')

@app.route("/login", methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = users.find_one({'username': username})
        if (user and check_password_hash(user['password'], password)):
            return redirect("http://localhost:3000/entries")
        else:
            flash('Invalid credentials', 'danger')
    
    return render_template('login.html')


@app.route("/analysis/<id>",methods=['GET','POST'])
def analysis(id):
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
    try:
        window_size1 = int(request.args.get('window_size1', 5))
        window_size2 = int(request.args.get('window_size2', 10))
        if window_size1 <= 0 or window_size2 <= 0:
            return jsonify({'error': 'Window sizes must be positive integers.'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid window size parameter.'}), 400

    entries = mongo.db.backend.find()
    timestamps = []
    averages = []
    for entry in entries:
        avg = mongo.db.analysis.find_one({"_id": entry["_id"]})['avg']
        timestamps.append(entry["Timestamp"])
        averages.append(avg)
    timestamps = pd.to_datetime(timestamps)
    data = pd.DataFrame({'Timestamp': timestamps, 'Average': averages})
    data['Date'] = data['Timestamp'].dt.date
    daily_data = data.groupby('Date').agg({'Average': 'mean'}).reset_index()
    daily_data['Timestamp'] = pd.to_datetime(daily_data['Date'])
    daily_data[f'Moving_Avg_{window_size1}D'] = daily_data['Average'].rolling(window=window_size1, min_periods=1).mean()
    daily_data[f'Moving_Avg_{window_size2}D'] = daily_data['Average'].rolling(window=window_size2, min_periods=1).mean()
    fig = Figure(figsize=(12, 7), dpi=80)
    ax = fig.subplots()

    ax.bar(daily_data['Timestamp'], daily_data['Average'], label='Daily Sentiment Average', color='lightblue', alpha=0.6)
    ax.plot(daily_data['Timestamp'], daily_data[f'Moving_Avg_{window_size1}D'], label=f'{window_size1}-Day Moving Average', color='red', linestyle='--', linewidth=2)
    ax.plot(daily_data['Timestamp'], daily_data[f'Moving_Avg_{window_size2}D'], label=f'{window_size2}-Day Moving Average', color='green', linestyle='--', linewidth=2)
    ax.set_xlabel('Date')
    ax.set_ylabel('Sentiment Average')
    ax.set_title('Daily Sentiment Analysis with Moving Averages')
    plt.xticks(rotation=45)
    ax.legend()

    buf = BytesIO()
    fig.savefig(buf, format="png")

    img_data = base64.b64encode(buf.getbuffer()).decode("ascii")
    return jsonify({'img': img_data})
    
