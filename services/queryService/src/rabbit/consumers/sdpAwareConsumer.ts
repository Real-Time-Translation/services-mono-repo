import {socketIO} from "../../index.js";
import {EventType} from "../../socket/constants.js";

export const sdpAwareConsumer = (payload: any) => {
    const clientSocketIdToNotify = payload.offererIdToNotify
    const sdp = payload.sdp
    socketIO.to(clientSocketIdToNotify).emit(EventType.AnswererSDPReady, sdp)
}