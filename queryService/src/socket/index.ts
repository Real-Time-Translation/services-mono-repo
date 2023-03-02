import {Server as SocketIOServer} from "socket.io";
import {Server as HTTPServer} from 'http'
import {EventType} from "./constants.js";
import {Channel as AMPQChannel} from 'amqplib'

let io: SocketIOServer

export const createSocketIO = (httpServer: HTTPServer
) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        }
    });
}

export const listenEvents = (ampqChannel: AMPQChannel) => {
    io.on(EventType.Connect, (socket) => {
        console.log('connected')

        socket.on(EventType.CreateMeeting, () => {
            /** Send event to rabbit */
            const jsonMsg = JSON.stringify({})
            ampqChannel.publish("", "CreateMeetingQueue", Buffer.from(jsonMsg))
        })

    })
}

