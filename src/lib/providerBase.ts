/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Provider,
    Executable,
    SessionConfig,
    ResourceTimingEntry,
    ResultBundle,
    TestConfiguration,
    TestSetupResult,
    HttpHeader,
} from "../@types"
import * as Beacon from "./beacon"
import beacon from "../util/beacon"

/**
 * TODO
 */
export default abstract class ProviderBase implements Provider {
    /**
     * TODO
     */
    sessionConfig?: SessionConfig

    /**
     * TODO
     */
    abstract name: string

    /**
     * TODO
     */
    abstract fetchSessionConfig(): Promise<SessionConfig>

    /**
     * TODO
     */
    abstract expandTasks(): Executable[]

    /**
     * TODO
     * @param timingEntry TODO
     * @param response TODO
     * @param testConfig TODO
     * @param setupResult TODO
     */
    abstract createTestResult(
        timingEntry: ResourceTimingEntry,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<ResultBundle>

    /**
     * TODO
     * @param testConfig TODO
     * @param testData TODO
     */
    abstract makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data

    /**
     * TODO
     * @param testConfig TODO
     */
    abstract getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * TODO
     * @param testConfig TODO
     */
    abstract getResourceRequestHeaders(
        testConfig: TestConfiguration,
    ): HttpHeader[]

    /**
     * TODO
     */
    abstract shouldRun(): boolean

    /**
     * Providers override this if they wish to perform something aside from
     * simple JSON-encoding.
     * @param testConfig TODO
     * @param data TODO
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string {
        return JSON.stringify(data)
    }

    /**
     * TODO
     * @param testConfig TODO
     * @param encodedBeaconData TODO
     */
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void {
        beacon(this.makeFetchBeaconURL(testConfig), encodedBeaconData)
    }

    /**
     * TODO
     * @param value TODO
     */
    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    /**
     * A subclass might not override this if it overrides
     * {@link ProviderBase.sendBeacon} instead.
     * @param testConfig TODO
     */
    makeFetchBeaconURL(testConfig: TestConfiguration): string {
        throw new Error("Method not implemented.")
    }

    /**
     * A no-op implementation of {@link Provider.testSetUp}
     * @param config TODO
     */
    testSetUp(testConfig: TestConfiguration): Promise<TestSetupResult> {
        return Promise.resolve({})
    }

    /**
     * A no-op implementation of {@link Provider.testTearDown}
     * @param config TODO
     */
    testTearDown(testData: ResultBundle): Promise<ResultBundle> {
        return Promise.resolve(testData)
    }
}
