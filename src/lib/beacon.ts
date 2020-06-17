/**
 * Beacon.State represents the possible values of the Beacon.Data.state flag
 */
export enum State {
    Success,
    Failure,
    Unknown,
}

/**
 * Beacon.Data represents test data to be sent back according to provider specifications
 */
export interface Data {
    state: State
    testType: string
    data?: {
        [key: string]: any
    }
}
