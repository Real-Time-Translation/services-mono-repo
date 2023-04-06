import {v4 as uuidv4} from 'uuid';
import {dbConnection} from "../../db/connect.js";

export const onMeetingCreateConsumer = (payload: any) => {

    return new Promise(resolve => {

        const meetingId = uuidv4()
        dbConnection.db?.collection("meetings").insertOne({
            id: meetingId
        }).then(() => {
            const result = {
                ...payload, meetingId
            }
            resolve(result)
        })
    })


}