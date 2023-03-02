import {Server as SocketIOServer} from "socket.io";
import {Server as HTTPServer} from 'http'
import {Events} from "./constants.js";

let io: SocketIOServer

export const createSocketIO = (httpServer: HTTPServer
) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        }
    });
}

export const listenEvents = () => {
    io.on(Events.connection, (socket) => {
        console.log('socket connected:', socket.id)
    })
}
