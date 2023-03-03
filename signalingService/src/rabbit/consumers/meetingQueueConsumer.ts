import { v4 as uuidv4 } from 'uuid';
import {Db} from "mongodb";
import {ConsumeMessage} from "amqplib";

export const meetingQueueConsumer = (message: ConsumeMessage | null, db: Db) => {
    const roomId = uuidv4()

}