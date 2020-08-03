/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BeaconData,
    Executable,
    Provider,
    ResourceTimingEntry,
    SendBeaconResult,
    TestResultBundle,
    TestSetupResult,
} from "../@types"
import beacon, { BeaconMethod } from "../util/beacon"
import { KnownErrors } from "./errors"

/**
 * A common base class for providers.
 *
 * @typeParam SC The type to be used for the internal session configuration.
 * @typeParam TC The type to be used for the test configuration.
 */
export default abstract class ProviderBase<SC, TC> implements Provider {
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
     * A default implementation of {@link Provider.getBeaconMethod}. Providers
     * may override this if they ever need to send beacon data using GET
     * requests based on the test configuration.
     */
    getBeaconMethod(testConfig: TC): BeaconMethod {
        return BeaconMethod.Post
    }

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
    private _sessionConfig?: SC

    /**
     * See {@link Provider.name}.
     */
    get name(): string {
        return this._name
    }

    /**
     * See {@link Provider.fetchSessionConfig}.
     */
    abstract fetchSessionConfig(): Promise<SC>

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
        testConfig: TC,
        setupResult: TestSetupResult,
    ): Promise<TestResultBundle>

    /**
     * See {@link Provider.makeBeaconData}
     */
    abstract makeBeaconData(
        testConfig: TC,
        testData: TestResultBundle,
    ): BeaconData

    /**
     * See {@link Provider.getResourceUrl}.
     */
    abstract getResourceUrl(testConfig: TC): string

    /**
     * See {@link Provider.getResourceRequestHeaders}.
     */
    abstract getResourceRequestHeaders(testConfig: TC): Record<string, string>

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
    encodeBeaconData(testConfig: TC, data: BeaconData): string {
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
        testConfig: TC,
        encodedBeaconData: string,
    ): Promise<SendBeaconResult> {
        return beacon(
            this.makeBeaconURL(testConfig),
            encodedBeaconData,
            this.getBeaconMethod(testConfig),
        )
    }

    /**
     * See {@link Provider.setSessionConfig}.
     */
    setSessionConfig(value: SC): void {
        this._sessionConfig = value
    }

    /**
     * See {@link Provider.sessionConfig}.
     */
    get sessionConfig(): SC {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        return this._sessionConfig!
    }

    /**
     * See {@link Provider.makeBeaconURL}.
     * @remarks
     * A subclass might not override this if it overrides
     * {@link ProviderBase.sendBeacon} instead.
     */
    makeBeaconURL(testConfig: TC): string {
        throw new Error("Method not implemented.")
    }

    /**
     * See {@link Provider.testSetUp}.
     * @remarks
     * A no-op implementation for providers that don't need to perform any
     * setup activity.
     */
    testSetUp(testConfig: TC): Promise<TestSetupResult> {
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
