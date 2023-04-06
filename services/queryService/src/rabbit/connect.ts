import ampq, {Options, Channel} from "amqplib";
import Connect = Options.Connect;

/** RabbitMQ connect */
const RABBIT = process.env.RABBIT as Connect;

export enum RaabbitQueue {
    MeetingEvent = 'MeetingEvent',
    MeetingEventAware = 'MeetingEventAware',
}

export enum MeetingEvent {
    CreateMeeting = "CreateMeeting",
    JoinMeeting = "JoinMeeting",
    SetSDP = "SetSDP",
    ICEReady = "ICEReady"
}

export interface RabbitMQChannel {
    channel: ampq.Channel | null
}

export const rabbitMQChannel: RabbitMQChannel = {
    channel: null
}

export const connectRabbit = async (): Promise<Channel> => {
    return new Promise(async (resolve, reject) => {
        try {
            const messagingConnection = await ampq.connect(RABBIT);
            const channel = await messagingConnection.createChannel();
            await channel.assertQueue(RaabbitQueue.MeetingEvent)
            await channel.assertQueue(RaabbitQueue.MeetingEventAware)
            rabbitMQChannel.channel = channel
            resolve(channel)
        }
        catch (e) {
            reject(e)
        }
    })
}