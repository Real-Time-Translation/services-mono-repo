import {Server as SocketIOServer} from "socket.io";
import {Server as HTTPServer} from 'http'
import {EventType} from "./constants.js";
import {Channel as AMPQChannel} from 'amqplib'
import {RaabbitQueue} from "../rabbit/connect.js";

export const createSocketIO = (httpServer: HTTPServer): SocketIOServer => {
    return new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
        }
    });
}

/**............................Mocks.....................................  */
export type ParticipantSDPRole = 'offerer' | 'answerer'
export type JoinCb = (param: JoinResult) => void

export interface JoinResult {
    sdpRole: ParticipantSDPRole,
    offererSDP?: string
}

export interface SDPSetResult {
    sdpRole: ParticipantSDPRole,
    sdp: string
}

const mockSignaling = {
    meetings: [
        {
            id: '1',
            offererId: '',
            answererId: '',
            offererSDP: '',
            answererSDP: ''
        },
        {
            id: '2',
            offererId: '',
            answererId: '',
            offererSDP: '',
            answererSDP: ''
        },
        {
            id: '3',
            offererId: '',
            answererId: '',
            offererSDP: '',
            answererSDP: ''
        },
        {
            id: '4',
            offererId: '',
            answererId: '',
            offererSDP: '',
            answererSDP: ''
        }
    ]
}
/**......................................................................  */


/** Listening events from client */
/** Сделать 1 queue для всех эвентов в сервер сигнализации
 *  и передавать туда параметр с типом события */
export const listenEvents = (io: SocketIOServer, ampqChannel: AMPQChannel) => {
    io.on(EventType.Connect, (socket) => {
        socket.on(EventType.CreateMeeting, () => {
            const jsonMsg = JSON.stringify({clientSocketId: socket.id})
            ampqChannel.publish("", RaabbitQueue.OnCreateMeetingRequestQueue, Buffer.from(jsonMsg))
        })
        /**............................Mocks.....................................  */

        socket.on(EventType.JoinMeeting, (meetingId: string, onJoined: JoinCb) => {
            const meeting = mockSignaling.meetings.find((meeting) => meeting.id === meetingId)
            if (meeting) {
                if (!meeting.offererId) {
                    meeting.offererId = socket.id
                    onJoined({sdpRole: 'offerer'})
                    return;
                }
                if (!meeting.answererId) {
                    meeting.answererId = socket.id
                    const offererSDP = meeting.offererSDP
                    onJoined({sdpRole: 'answerer', offererSDP: offererSDP})
                }
            }
        })
        socket.on(EventType.SetSDP, (meetingId: string, sdpPayload: SDPSetResult) => {
            const meeting = mockSignaling.meetings.find((meeting) => meeting.id === meetingId)
            if (meeting) {
                if (sdpPayload.sdpRole === 'offerer') {
                    meeting.offererSDP = sdpPayload.sdp
                }
                if (sdpPayload.sdpRole === 'answerer') {
                    meeting.answererSDP = sdpPayload.sdp
                    io.to(meeting.offererId).emit(EventType.AnswererSDPReady, sdpPayload.sdp)
                }
            }
        })
        socket.on(EventType.IceCandidate, (meetingId: string, iceCandidate: string) => {
            const meeting = mockSignaling.meetings.find((meeting) => meeting.id === meetingId)
            let receiverId
            if (meeting) {
                if (socket.id === meeting.answererId) {
                    receiverId = meeting.offererId
                }
                if (socket.id === meeting.offererSDP) {
                    receiverId = meeting.answererId
                }
                if (receiverId) {
                    io.to(receiverId).emit(EventType.IceCandidate, iceCandidate)
                }
            }
        })


        /**......................................................................  */
    })
}

