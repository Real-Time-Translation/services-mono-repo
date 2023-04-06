import {dbConnection} from "../../db/connect.js";

export const onSettingSDPConsumer = (payload: any) => {

    return new Promise(async resolve => {
        const meetingId = payload.meetingId
        const role = payload.sdpPayload.sdpRole
        const sdp = payload.sdpPayload.sdp

        const meetingsCollection = dbConnection.db?.collection("meetings")
        const meeting = await meetingsCollection?.findOne({id: meetingId})

        if (role === 'offerer'){
            await meetingsCollection?.updateOne({id: meetingId}, {$set: {offererSDP: sdp}})
            resolve({role:'offerer'})
        }
        else if(role === 'answerer'){
            await meetingsCollection?.updateOne({id: meetingId}, {$set: {answererSDP: sdp}})
            resolve({role: 'answerer', offererIdToNotify: meeting?.offererId, sdp})
        }

    })
}