import {ConsumeMessage} from "amqplib";
import {MeetingEvent, RaabbitQueue, rabbitMQChannel} from "../connect.js";
import {onMeetingCreateConsumer} from "./onMeetingCreateConsumer.js";
import {onJoinMeetingConsumer} from "./onJoinMeetingConsumer.js";
import {onSettingSDPConsumer} from "./onSettingSDPConsumer.js";
import {onSettingICEConsumer} from "./onSettingICEConsumer.js";

export const meetingEventConsumer = (message: ConsumeMessage | null) => {
    if (message) {
        rabbitMQChannel?.channel?.ack(message)
    }

    if (message?.content) {
        const contentParsed = JSON.parse(message?.content.toString());
        const eventType = contentParsed.eventType;
        const payload = contentParsed.payload;

        switch (eventType as MeetingEvent) {
            case MeetingEvent.CreateMeeting:
                onMeetingCreateConsumer(payload).then(result => {
                    const dataToSend = {
                        payload: result,
                        eventType: eventType
                    }
                    const answerBuffer = Buffer.from(JSON.stringify(dataToSend))
                    rabbitMQChannel?.channel?.publish("",
                        RaabbitQueue.MeetingEventAware,
                        Buffer.from(answerBuffer))
                })
                break;

            case MeetingEvent.JoinMeeting:
                onJoinMeetingConsumer(payload).then(result => {
                    const dataToSend = {
                        payload: result,
                        eventType: eventType
                    }
                    const answerBuffer = Buffer.from(JSON.stringify(dataToSend))
                    rabbitMQChannel?.channel?.publish("",
                        RaabbitQueue.MeetingEventAware,
                        Buffer.from(answerBuffer))
                })
                break;

            case MeetingEvent.SetSDP:
                onSettingSDPConsumer(payload).then((result: any) => {
                    if (result.role === 'answerer') {
                        const dataToSend = {
                            eventType: eventType,
                            payload: {
                                sdp: result.sdp,
                                offererIdToNotify: result.offererIdToNotify
                            }
                        }
                        const answerBuffer = Buffer.from(JSON.stringify(dataToSend))
                        rabbitMQChannel?.channel?.publish("",
                            RaabbitQueue.MeetingEventAware,
                            Buffer.from(answerBuffer))
                    }
                })
                break;
            case MeetingEvent.ICEReady:
                onSettingICEConsumer(payload).then((result: any) => {
                    const dataToSend = {
                        eventType: eventType,
                        payload: {
                            receiverId: result.receiverId,
                            iceCandidate: result.iceCandidate,
                        }
                    }
                    const answerBuffer = Buffer.from(JSON.stringify(dataToSend))
                    rabbitMQChannel?.channel?.publish("",
                        RaabbitQueue.MeetingEventAware,
                        Buffer.from(answerBuffer))
                })
                break;
        }
    }
}