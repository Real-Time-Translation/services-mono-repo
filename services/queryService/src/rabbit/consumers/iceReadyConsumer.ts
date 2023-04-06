import {EventType} from "../../socket/constants.js";
import {socketIO} from "../../index.js";

export const iceReadyConsumer = (payload: any) => {
    const receiverId = payload.receiverId
    const iceCandidate = payload.iceCandidate
    socketIO.to(receiverId).emit(EventType.IceCandidate, iceCandidate)
}

