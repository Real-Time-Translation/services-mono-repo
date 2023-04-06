import {ConsumeMessage} from "amqplib";
import {MeetingEvent, rabbitMQChannel} from "../connect.js";
import {meetingCreatedConsumer} from "./meetingCreatedConsumer.js";
import {userJoinedConsumer} from "./userJoinedConsumer.js";
import {sdpAwareConsumer} from "./sdpAwareConsumer.js";
import {iceReadyConsumer} from "./iceReadyConsumer.js";

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
                meetingCreatedConsumer(payload);
                break;
            case MeetingEvent.JoinMeeting:
                userJoinedConsumer(payload);
                break;
            case MeetingEvent.SetSDP:
                sdpAwareConsumer(payload)
                break;
            case MeetingEvent.ICEReady:
                iceReadyConsumer(payload)
        }
    }
}