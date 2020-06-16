export enum State {
    Success,
    Failure,
    Unknown,
}

export interface Data {
    state: State
    testType: string
    data?: {
        [key: string]: any
    }
}
