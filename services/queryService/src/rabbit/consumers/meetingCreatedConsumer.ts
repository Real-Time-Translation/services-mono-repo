import {EventType} from "../../socket/constants.js";
import {socketIO} from "../../index.js";

export const meetingCreatedConsumer = (payload: any) => {
    const clientSocketIdToNotify = payload.clientSocketId
    const createdMeetingId = payload.meetingId
    socketIO.to(clientSocketIdToNotify).emit(EventType.MeetingCreated, createdMeetingId)
}