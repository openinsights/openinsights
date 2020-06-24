import { TestConfiguration } from "../@types"

/**
 * Beacon.State represents the possible values of the Beacon.Data.state flag.
 */
export enum State {
    /**
     * The test completed successfully.
     */
    Success,
    /**
     * The test failed.
     */
    Failure,
    /**
     * Test status is undetermined.
     */
    Unknown,
}

/**
 * Beacon.Data represents test data to be sent back according to provider
 * specifications.
 */
export interface Data {
    /**
     * The result state of the associated {@link Test}
     */
    state: State
    /**
     * The configuration of the associated {@link Test}
     */
    testConfig: TestConfiguration
    /**
     * An object containing provider-defined test data to be beaconed.
     */
    data?: {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        [key: string]: any
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }
}
