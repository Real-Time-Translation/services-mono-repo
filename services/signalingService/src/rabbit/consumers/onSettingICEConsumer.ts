import {dbConnection} from "../../db/connect.js";

export const onSettingICEConsumer = (payload: any) => {
    return new Promise(async resolve => {
        const meetingId = payload.meetingId
        const iceCandidate = payload.iceCandidate
        const sender = payload.sender

        const meetingsCollection = dbConnection.db?.collection("meetings")
        const meeting = await meetingsCollection?.findOne({id: meetingId})

        let receiverId = null

        if (meeting && meeting.offererId === sender){
            receiverId = meeting.answererId
        }
        else if (meeting && meeting.answererId === sender){
            receiverId = meeting.offererId
        }

        resolve({
            receiverId, iceCandidate
        })
    })
}
