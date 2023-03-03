import {Server as SocketIOServer} from "socket.io";
import {Server as HTTPServer} from 'http'
import {EventType} from "./constants.js";
import {Channel as AMPQChannel} from 'amqplib'
import {RaabbitQueue} from "../rabbit/connect.js";

export const createSocketIO = (httpServer: HTTPServer) : SocketIOServer => {
    return new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        }
    });
}

/** Listening events from client */
export const listenEvents = (io: SocketIOServer, ampqChannel: AMPQChannel) => {
    io.on(EventType.Connect, (socket) => {
        socket.on(EventType.CreateMeeting, () => {
            const jsonMsg = JSON.stringify({clientSocketId: socket.id})
            ampqChannel.publish("", RaabbitQueue.OnCreateMeetingRequestQueue, Buffer.from(jsonMsg))
        })

    })
}

