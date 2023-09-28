from flask import Flask, Response
from flask_restful import Resource, Api
from pymongo import MongoClient
import cv2

app = Flask(__name__)
api = Api(app)

client = MongoClient('mongodb+srv://rohitbhujabal1:rohit@cluster0.5hlwa6a.mongodb.net/')
db = client['overlay_database'] 
overlays_collection = db['overlays']

@app.route('/api/overlay')
def livestream():
    cap = cv2.VideoCapture('http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg')

    def generate_frames():
        while True:
            success, frame = cap.read()
            if not success:
                break
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame.tobytes() + b'\r\n')

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

class OverlayResource(Resource):
    def get(self, overlay_id):
        overlay = overlays_collection.find_one({"_id": overlay_id})
        return overlay or {}, 200

    def put(self, overlay_id):
        overlay_data = request.json
        overlay_data["_id"] = overlay_id 
        overlays_collection.replace_one({"_id": overlay_id}, overlay_data, upsert=True)
        return overlay_data, 201

    def delete(self, overlay_id):
        result = overlays_collection.delete_one({"_id": overlay_id})
        if result.deleted_count == 1:
            return '', 204
        else:
            return '', 404

api.add_resource(OverlayResource, '/overlay/<string:overlay_id>')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
