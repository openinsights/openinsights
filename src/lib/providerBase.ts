import { Provider, Executable, SessionConfig, ResourceTimingEntry, ResultBundle } from "../@types"
import * as Beacon from './beacon'
import beacon from '../util/beacon'

export default abstract class ProviderBase implements Provider {
    sessionConfig?: SessionConfig

    abstract name: string
    abstract fetchSessionConfig(): Promise<SessionConfig>
    abstract expandTasks(): Executable[]
    abstract createTestResult(timingEntry: ResourceTimingEntry, response: Response, testConfig: unknown): Promise<ResultBundle>
    abstract makeBeaconData(testConfig: unknown, testData: ResultBundle): Beacon.Data
    abstract getResourceUrl(config: unknown): string
    abstract shouldRun(): boolean

    /**
     * Providers override this if they wish to perform something aside from
     * simple JSON-encoding.
     *
     * @param testConfig
     * @param data
     */
    encodeBeaconData(testConfig: unknown, data: Beacon.Data): string {
        return JSON.stringify(data)
    }

    sendBeacon(testConfig: unknown, encodedBeaconData: string): void {
        beacon(this.makeFetchBeaconURL(testConfig), encodedBeaconData)
    }

    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    /**
     * A subclass might not override this if it overrides ProviderBase::sendBeacon instead
     * @param testConfig
     */
    makeFetchBeaconURL(testConfig: unknown): string {
        throw new Error("Method not implemented.")
    }

    markTestStart(config: unknown): void {
        // Do nothing
    }
}
