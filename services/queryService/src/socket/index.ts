import {Server as SocketIOServer} from "socket.io";
import {Server as HTTPServer} from 'http'
import {EventType} from "./constants.js";
import {MeetingEvent, RaabbitQueue, rabbitMQChannel} from "../rabbit/connect.js";
import {socketIO} from "../index.js";


export const createSocketIO = (httpServer: HTTPServer): SocketIOServer => {
    return new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        }
    });
}

export const listenEvents = () => {
    socketIO.on(EventType.Connect, (socket) => {
        socket.on(EventType.CreateMeeting, () => {
            const jsonData = JSON.stringify({
                eventType: MeetingEvent.CreateMeeting,
                payload: {clientSocketId: socket.id}
            })
            rabbitMQChannel.channel?.publish("", RaabbitQueue.MeetingEvent, Buffer.from(jsonData))
        })

        socket.on(EventType.JoinMeeting, (meetingId: string) => {
            const jsonData = JSON.stringify({
                eventType: MeetingEvent.JoinMeeting,
                payload: {meetingId: meetingId, participantId: socket.id}
            })
            rabbitMQChannel.channel?.publish("", RaabbitQueue.MeetingEvent, Buffer.from(jsonData))
        })

        socket.on(EventType.SetSDP, (meetingId: string, sdpPayload: any) => {
            const jsonData = JSON.stringify({
                eventType: MeetingEvent.SetSDP,
                payload: {
                    meetingId,
                    sdpPayload,
                    participantId: socket.id
                }
            })
            rabbitMQChannel.channel?.publish("", RaabbitQueue.MeetingEvent, Buffer.from(jsonData))
        })
        socket.on(EventType.IceCandidate, (meetingId: string, iceCandidate: string) => {
            const jsonData = JSON.stringify({
                eventType: MeetingEvent.ICEReady,
                payload: {
                    meetingId,
                    iceCandidate,
                    sender: socket.id
                }
            })
            rabbitMQChannel.channel?.publish("", RaabbitQueue.MeetingEvent, Buffer.from(jsonData))
        })

    })
}

