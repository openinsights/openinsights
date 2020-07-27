/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BeaconData,
    Executable,
    Provider,
    ResourceTimingEntry,
    SendBeaconResult,
    SessionConfig,
    TestConfiguration,
    TestResultBundle,
    TestSetupResult,
} from "../@types"
import beacon from "../util/beacon"
import { KnownErrors } from "./errors"

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
     * See {@link Provider.onSendBeaconRejected}
     *
     * @remarks
     *
     * Providers can override this to provide special handling.
     */
    onSendBeaconRejected(error: Error): void {
        this.handleError(KnownErrors.SendBeacon, error)
    }

    /**
     * See {@link Provider.onSendBeaconResolved}
     *
     * @remarks
     *
     * Providers can override this to provide special handling, e.g. log an
     * event to a third-party monitoring service.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    onSendBeaconResolved(result: SendBeaconResult): void {}
    /* eslint-enable @typescript-eslint/no-empty-function */

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
    ): Promise<TestResultBundle>

    /**
     * See {@link Provider.makeBeaconData}
     */
    abstract makeBeaconData(
        testConfig: TestConfiguration,
        testData: TestResultBundle,
    ): BeaconData

    /**
     * See {@link Provider.getResourceUrl}.
     */
    abstract getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * See {@link Provider.getResourceRequestHeaders}.
     */
    abstract getResourceRequestHeaders(
        testConfig: TestConfiguration,
    ): Record<string, string>

    /**
     * See {@link Provider.handleError}
     */
    abstract handleError(errorType: KnownErrors, innerError: Error): void

    /**
     * See {@link Provider.shouldRun}.
     */
    abstract shouldRun(): boolean

    /**
     * See {@link Provider.encodeBeaconData}.
     * @remarks
     * A default implementation that does simple JSON-encoding.
     */
    encodeBeaconData(testConfig: TestConfiguration, data: BeaconData): string {
        return JSON.stringify(data)
    }

    /**
     * See {@link Provider.sendBeacon}.
     * @remarks
     * Provides a simple mechanism using the Beacon API, with the Fetch API as
     * a fallback. Providers may override this if they require more specialized
     * reporting, e.g. utilize WebSockets, invoke a 3rd party library, etc.
     */
    sendBeacon(
        testConfig: TestConfiguration,
        encodedBeaconData: string,
    ): Promise<SendBeaconResult> {
        return beacon(this.makeBeaconURL(testConfig), encodedBeaconData)
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
    testTearDown(testData: TestResultBundle): Promise<TestResultBundle> {
        return Promise.resolve(testData)
    }
}
