import {Channel, ConsumeMessage} from 'amqplib'
import {Server as SocketIOServer} from "socket.io";
import {EventType} from "../../socket/constants.js";

export const meetingCreatedConsumer = (message: ConsumeMessage | null, ampqChannel: Channel, socketIOServer: SocketIOServer) => {
    if(message) ampqChannel.ack(message)
    if(message?.content) {
        const contentParsed = JSON.parse(message?.content.toString());
        const clientSocketIdToNotify = contentParsed?.clientSocketId
        const createdMeetingId = contentParsed?.meetingId
        socketIOServer.to(clientSocketIdToNotify).emit(EventType.MeetingCreated, createdMeetingId)
    }

}