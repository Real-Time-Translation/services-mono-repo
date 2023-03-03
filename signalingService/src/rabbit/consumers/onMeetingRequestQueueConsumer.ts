import {Db} from "mongodb";
import {Channel, ConsumeMessage} from "amqplib";
import {RaabbitQueue} from "../connect.js";
import { v4 as uuidv4 } from 'uuid';

export const onMeetingRequestQueueConsumer = (message: ConsumeMessage | null, db: Db, ampqChannel: Channel) => {
    if(message) {ampqChannel.ack(message)}

    const createMeetingId = () => {
        return uuidv4()
    }

    if (message?.content) {
        const contentParsed = JSON.parse(message?.content.toString());
        const answerWithCreatedMeetingId = {
            ...contentParsed, meetingId: createMeetingId()
        }

        const answerBuffer = Buffer.from(JSON.stringify(answerWithCreatedMeetingId))

        ampqChannel.publish("", RaabbitQueue.MeetingCreatedQueue, Buffer.from(answerBuffer))
    }

}


// const roomsCollection = db.collection('rooms')
// const roomId =new ObjectId();
// roomsCollection.insertOne({_id: roomId}).then(()=> {
//     console.log('inserted')
// }).then(()=> {
//     message && ampqChannel.ack(message)
// })