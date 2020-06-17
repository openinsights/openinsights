import { Provider, Executable, SessionConfig, ResourceTimingEntry, ResultBundle, TestConfiguration, TestSetupResult } from "../@types"
import * as Beacon from './beacon'
import beacon from '../util/beacon'

export default abstract class ProviderBase implements Provider {
    sessionConfig?: SessionConfig

    abstract name: string
    abstract fetchSessionConfig(): Promise<SessionConfig>
    abstract expandTasks(): Executable[]
    abstract createTestResult(timingEntry: ResourceTimingEntry, response: Response, testConfig: TestConfiguration, setupResult: TestSetupResult): Promise<ResultBundle>
    abstract makeBeaconData(testConfig: TestConfiguration, testData: ResultBundle): Beacon.Data
    abstract getResourceUrl(testConfig: TestConfiguration): URL
    abstract shouldRun(): boolean

    /**
     * Providers override this if they wish to perform something aside from
     * simple JSON-encoding.
     *
     * @param testConfig
     * @param data
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string {
        return JSON.stringify(data)
    }

    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void {
        beacon(this.makeFetchBeaconURL(testConfig), encodedBeaconData)
    }

    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    /**
     * A subclass might not override this if it overrides ProviderBase::sendBeacon instead
     * @param testConfig
     */
    makeFetchBeaconURL(testConfig: TestConfiguration): string {
        throw new Error("Method not implemented.")
    }

    /**
     * A no-op implementation of {@link Provider.testSetup}
     * @param config
     */
    testSetup(config: TestConfiguration): Promise<TestSetupResult> {
        return Promise.resolve({ data: {} })
    }
}
