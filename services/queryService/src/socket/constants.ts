export enum EventType {
    Connect = 'connect',
    CreateMeeting = 'createMeeting',
    MeetingCreated = 'meetingCreated',

    /** Meeting connection setup between clients */
    JoinMeeting = 'joinMeeting',
    SetSDP = 'setSDP',
    AnswererSDPReady = 'answererSDPReady',
    IceCandidate = 'iceCandidate'
}