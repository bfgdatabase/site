
import paho.mqtt.client as paho
import time
import threading
import time
import random
import json
import datetime

broker = "localhost"
port = 1883

threads = []

anchors_topics = ["id_mark_8","id_mark_9", "id_mark_10", "id_mark_11", "id_mark_12", "id_mark_13", "id_mark_14", "id_mark_15", "id_mark_16", "id_mark_17", "id_mark_18", "id_mark_19"]
vel_vectors = []
pos_vectors = []


for i in range(0, len(anchors_topics)):
    pos_vectors.append([10.0 * random.random(), 10.0 * random.random()])
    vel_vectors.append([0.1*(2.0 * random.random() - 1.0) , 0.1*(2.0 * random.random() - 1.0)])
    

client1 = paho.Client("Client")                         
client1.connect(broker,port)  


def thread_function(idx, topic, ):
    while(True):
        time.sleep(0.5)

        vel_vectors[idx] = [vel_vectors[idx][0] + 0.002 * random.random() - 0.001, vel_vectors[idx][1] + 0.002 * random.random() - 0.001]
        pos_vectors[idx] = [pos_vectors[idx][0] + vel_vectors[idx][0], pos_vectors[idx][1] + vel_vectors[idx][1]]
        if(pos_vectors[idx][0] <= 0):
            pos_vectors[idx][0] = 0.0;
            vel_vectors[idx][0] = -vel_vectors[idx][0];

        if(pos_vectors[idx][1] <= 0):
            pos_vectors[idx][1] = 0.0;
            vel_vectors[idx][1] = -vel_vectors[idx][1];

        if(pos_vectors[idx][0] >= 10.0):
            pos_vectors[idx][0] = 10.0;
            vel_vectors[idx][0] = -vel_vectors[idx][0];

        if(pos_vectors[idx][1] >= 10.0):
            pos_vectors[idx][1] = 10.0;
            vel_vectors[idx][1] = -vel_vectors[idx][1];

        tm = str(datetime.datetime.utcnow())
        ret = client1.publish(anchors_topics[idx], json.dumps({"id_location": 3, "name": anchors_topics[idx], "pos_x": pos_vectors[idx][0], "pos_y": pos_vectors[idx][1],  "timeis": str(datetime.datetime.utcnow())}))  

for idx in range(0, len(anchors_topics)):
    thread = threading.Thread(target=thread_function, args=(idx, "test"))
    threads.append(thread)
    thread.start()

for x in threads:
     x.join()