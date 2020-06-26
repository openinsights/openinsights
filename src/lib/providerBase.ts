/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Provider,
    Executable,
    ResourceTimingEntry,
    ResultBundle,
    SessionConfig,
    TestConfiguration,
    TestSetupResult,
    HttpHeader,
} from "../@types"
import * as Beacon from "./beacon"
import beacon from "../util/beacon"

/**
 * A common base class for providers.
 */
export default abstract class ProviderBase implements Provider {
    /**
     * @param _name A provider-defined name.
     */
    constructor(
        /**
         * @remarks
         * This can be used for logging purposes.
         */
        private _name: string,
    ) {}

    /**
     * @remarks
     * This is saved at the beginning of a RUM session within {@link start}.
     */
    private _sessionConfig?: SessionConfig

    /**
     * See {@link Provider.name}.
     */
    get name(): string {
        return this._name
    }

    /**
     * See {@link Provider.fetchSessionConfig}.
     */
    abstract fetchSessionConfig(): Promise<SessionConfig>

    /**
     * See {@link Provider.expandTasks}.
     */
    abstract expandTasks(): Executable[]

    /**
     * See {@link Provider.createFetchTestResult}.
     */
    abstract createFetchTestResult(
        timingEntry: ResourceTimingEntry,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<ResultBundle>

    /**
     * See {@link Provider.makeBeaconData}
     */
    abstract makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data

    /**
     * See {@link Provider.getResourceUrl}.
     */
    abstract getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * See {@link Provider.getResourceRequestHeaders}.
     */
    abstract getResourceRequestHeaders(
        testConfig: TestConfiguration,
    ): HttpHeader[]

    /**
     * See {@link Provider.shouldRun}.
     */
    abstract shouldRun(): Promise<boolean>

    /**
     * See {@link Provider.encodeBeaconData}.
     * @remarks
     * Handles simple JSON-encoding.
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string {
        return JSON.stringify(data)
    }

    /**
     * See {@link Provider.sendBeacon}.
     * @remarks
     * Provides a simple mechanism using the Beacon API, with the Fetch API as
     * a fallback. Providers may override this if they require more specialized
     * reporting, e.g. utilize websockets, invoke a 3rd party library, etc.
     */
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void {
        beacon(this.makeBeaconURL(testConfig), encodedBeaconData)
    }

    /**
     * See {@link Provider.setSessionConfig}.
     */
    setSessionConfig(value: SessionConfig): void {
        this._sessionConfig = value
    }

    /**
     * See {@link Provider.sessionConfig}.
     */
    get sessionConfig(): SessionConfig | undefined {
        return this._sessionConfig
    }

    /**
     * See {@link Provider.makeBeaconURL}.
     * @remarks
     * A subclass might not override this if it overrides
     * {@link ProviderBase.sendBeacon} instead.
     */
    makeBeaconURL(testConfig: TestConfiguration): string {
        throw new Error("Method not implemented.")
    }

    /**
     * See {@link Provider.testSetUp}.
     * @remarks
     * A no-op implementation for providers that don't need to perform any
     * setup activity.
     */
    testSetUp(testConfig: TestConfiguration): Promise<TestSetupResult> {
        return Promise.resolve({})
    }

    /**
     * See {@link Provider.testTearDown}.
     * @remarks
     * A no-op implementation for providers that don't need to perform any
     * tear down activity.
     */
    testTearDown(testData: ResultBundle): Promise<ResultBundle> {
        return Promise.resolve(testData)
    }
}
