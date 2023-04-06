export enum EventType {
    Connect = 'connect',
    CreateMeeting = 'createMeeting',
    MeetingCreated = 'meetingCreated',
    Joined = 'joined',

    /** Meeting connection setup between clients */
    JoinMeeting = 'joinMeeting',
    SetSDP = 'setSDP',
    AnswererSDPReady = 'answererSDPReady',
    IceCandidate = 'iceCandidate'
}