import ampq, {Options, Channel} from "amqplib";
import Connect = Options.Connect;

/** RabbitMQ connect */
const RABBIT = process.env.RABBIT as Connect;

export enum RaabbitQueue {
    OnCreateMeetingRequestQueue= 'OnCreateMeetingRequestQueue',
    MeetingCreatedQueue = 'MeetingCreatedQueue'
}

export const connectRabbit = async (): Promise<Channel> => {
    const messagingConnection = await ampq.connect(RABBIT);
    const channel = await messagingConnection.createChannel();
    await channel.assertQueue(RaabbitQueue.MeetingCreatedQueue)
    await channel.assertQueue(RaabbitQueue.OnCreateMeetingRequestQueue)
    return channel
}