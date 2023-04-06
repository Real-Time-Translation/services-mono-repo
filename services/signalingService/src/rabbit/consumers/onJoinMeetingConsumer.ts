import {dbConnection} from "../../db/connect.js";

export const onJoinMeetingConsumer = (payload: any) => {

    return new Promise(async (resolve, reject) => {
        const meetingId = payload.meetingId
        const participantId = payload.participantId
        const meetingsCollection = dbConnection.db?.collection("meetings")
        const meeting = await meetingsCollection?.findOne({id: meetingId})

        if (!meeting) {
            reject('No meeting with id:' + meetingId)
        }

        if (!meeting?.offererId) {
            await meetingsCollection?.updateOne({id: meetingId}, {$set: {offererId: participantId}})
            resolve({
                sdpRole: 'offerer',
                participantId
            })
        } else if (!meeting?.answererId) {
            await meetingsCollection?.updateOne({id: meetingId},
                {$set: {answererId: participantId}})
            resolve({
                sdpRole: 'answerer',
                offererSDP: meeting.offererSDP,
                participantId,
            })
        }
    })
}