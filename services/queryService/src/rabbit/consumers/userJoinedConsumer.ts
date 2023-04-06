import {socketIO} from "../../index.js";
import {EventType} from "../../socket/constants.js";

export const userJoinedConsumer = (payload: any) => {
    const clientSocketIdToNotify = payload.participantId
    const offererSDP = payload.offererSDP
    const clientSocketRole = payload.sdpRole
    socketIO.to(clientSocketIdToNotify)
        .emit(EventType.Joined, {sdpRole: clientSocketRole, offererSDP})
}