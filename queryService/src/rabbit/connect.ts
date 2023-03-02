import ampq, {Options, Channel} from "amqplib";
import Connect = Options.Connect;

/** RabbitMQ connect */
const RABBIT = process.env.RABBIT as Connect;

export const connectRabbit = async (): Promise<Channel> => {
    const messagingConnection = await ampq.connect(RABBIT);
    const channel = await messagingConnection.createChannel();
    await channel.assertQueue('q1')
    return channel
}