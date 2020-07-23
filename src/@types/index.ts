import { KnownErrors } from "../lib/errors"

/**
 * An interface representing simple objects mapping strings to basic primative
 * types.
 */
export interface SimpleObject {
    [key: string]:
        | SimpleObject
        | SimpleObject[]
        | Array<string | number | boolean | null>
        | boolean
        | number
        | string
        | null
        | undefined
}

/**
 * An interface for objects containing a set of executable tasks.
 */
export interface ExecutableContainer {
    /**
     * A list of {@link Executable} objects.
     */
    executables: Executable[]
}

/**
 * A type for objects returned by {@link Provider.fetchSessionConfig}
 * representing configuration for a RUM session.
 */
export type SessionConfig = ExecutableContainer

/**
 * An interface representing the configuration of a RUM test.
 */
export interface TestConfiguration {
    /**
     * Indicates the test type.
     */
    type: string
}

/**
 * An interface representing the result of a test's setup activity.
 */
export interface TestSetupResult {
    /**
     * A container for the test setup data
     */
    data?: SimpleObject
}

/**
 * Beacon.State represents the possible values of the Beacon.Data.state flag.
 */
export enum BeaconState {
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
export interface BeaconData {
    /**
     * The result state of the associated {@link Test}
     */
    state: BeaconState
    /**
     * The configuration of the associated {@link Test}
     */
    testConfig: TestConfiguration
    /**
     * An object containing provider-defined test data to be beaconed.
     */
    data?: SimpleObject
}

/**
 * A type representing a Resource Timing API entry having _entryType_
 * "resource".
 *
 * Alias for {@link SimpleObject}
 */
export type ResourceTimingEntry = SimpleObject

/**
 * An alias for a boolean-returning function that evaluates whether a Resource
 * Timing entry is valid. Used by
 * {@link getValidEntry} to assess validity of an
 * entry. Providers may override the default predicate.
 */
export type ResourceTimingEntryValidationPredicate = (
    entry: ResourceTimingEntry,
) => boolean

/**
 * Represents the result of one aspect of a test. There may be more than one
 * result object for a particular test type, in case multiple transactions are
 * involved.
 */
export type TestResult = SimpleObject

/**
 * Represents the completed result of a test.
 */
export interface TestResultBundle {
    /**
     * Name of the provider responsible for the test.
     */
    providerName?: string
    /**
     * Data to be sent to the provider's ingest services.
     */
    beaconData?: BeaconData
    /**
     * A string representing the test type.
     */
    testType: string
    /**
     * An array of objects representing individual component results.
     */
    data: TestResult[]
    /**
     * The result of any test setup activity.
     */
    setupResult: TestSetupResult
}

/**
 * Represents the return value of a "client info request".
 * @remarks
 * This type of request is typically made in order to capture the client
 * resolver geo. See {@link getClientInfo}.
 */
export type ClientInfo = SimpleObject

/**
 * Encapsulates the result of one provider's RUM session.
 */
export interface SessionResult {
    /**
     * An array containing the test result bundles for each individual test
     * performed.
     */
    testResults: TestResultBundle[]
}

/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * See W3C Spec Draft http://wicg.github.io/netinfo/
 * Edition: Draft Community Group Report 20 February 2019
 * See http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
 */
export declare interface Navigator extends NavigatorNetworkInformation {}

/**
 * See W3C Spec Draft http://wicg.github.io/netinfo/
 * Edition: Draft Community Group Report 20 February 2019
 * See http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
 */
declare interface WorkerNavigator extends NavigatorNetworkInformation {}
/* eslint-enable @typescript-eslint/no-empty-interface */

/**
 * See http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
 */
declare interface NavigatorNetworkInformation {
    readonly connection?: NetworkInformation
}

/**
 * See http://wicg.github.io/netinfo/#connection-types
 */
type NetworkConnectionType =
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "mixed"
    | "none"
    | "other"
    | "unknown"
    | "wifi"
    | "wimax"

/**
 * See http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
 */
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g"

/**
 * See http://wicg.github.io/netinfo/#dom-megabit
 */
type Megabit = number

/**
 * See http://wicg.github.io/netinfo/#dom-millisecond
 */
type Millisecond = number

/**
 * The primative type attributes from the navigator.connection object,
 * if present.
 * @remarks
 * See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
 */
export interface NetworkInformation {
    [key: string]:
        | NetworkConnectionType
        | EffectiveConnectionType
        | Megabit
        | Millisecond
        | boolean
}

/**
 * An interface representing an object with an execute method, generally a
 * {@link Test}.
 */
export interface Executable {
    /**
     * Execute a test and return a Promise resolving to a test result bundle.
     */
    execute(): Promise<TestResultBundle>
}

/**
 * A possible resolution result of the Promise returned by
 * {@link Provider.sendBeacon}.
 */
export type SendBeaconResult = Response | void

/**
 * An interface representing a provider.
 */
export interface Provider {
    /**
     * An attribute that can be used for logging purposes.
     */
    name: string

    /**
     * The {@link SessionConfig} object obtained from calling
     * {@link Provider.fetchSessionConfig}.
     */
    sessionConfig?: SessionConfig

    /**
     * A hook called before each test begins, giving the provider an
     * opportunity to perform any pre-test setup needed, such as recording a
     * timestamp.
     * @param testConfig The test configuration.
     */
    testSetUp(testConfig: TestConfiguration): Promise<TestSetupResult>

    /**
     * A hook called after each test has completed, giving the provider an
     * opportunity to perform any post-test activity needed.
     * @param testData The test results.
     */
    testTearDown(testData: TestResultBundle): Promise<TestResultBundle>

    /**
     * Called within {@link start} to sets the provider's session configuration
     * object after calling {@link ProviderBase.fetchSessionConfig}.
     * @param value The provider-defined configuration object resulting from a
     * call to {@link Provider.fetchSessionConfig}
     */
    setSessionConfig(value: SessionConfig): void

    /**
     * A hook called very early by the core module, enabling providers an
     * opportunity to determine if they should participate in the session,
     * e.g. based on user agent feature detection, random downsampling, etc.
     * It returns a Promise, in case a provider would like to make a network
     * request in order to make this determination.
     */
    shouldRun(): Promise<boolean>

    /**
     * @remarks
     * A provider implements this in order to define its logic for producing
     * a {@link SessionConfig} object at runtime.
     */
    fetchSessionConfig(): Promise<SessionConfig>

    /**
     * A provider implements this in order to define its logic for converting
     * the configuration from a {@link SessionConfig} object into one or more
     * {@link Executable} objects (usually {@link Fetch} or other classes
     * inheriting from {@link Test}).
     */
    expandTasks(): Executable[]

    /**
     * @remarks
     * A provider implements this in order to define its logic for creating
     * a {@link ResultBundle} describing the outcome of running a {@link Fetch}
     * test.
     * @param timingEntry The Resource Timing entry used to generate the test
     * result.
     * @param response The **Response** object resulting from the fetch
     * activity.
     * @param testConfig The test configuration.
     * @param setupResult The provider-defined result of any test setup
     * activity done prior to the fetch.
     */
    createFetchTestResult(
        timingEntry: ResourceTimingEntry,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<TestResultBundle>

    /**
     * @remarks
     * A provider implements this in order to create a beacon payload.
     * @param testConfig The test configuration.
     * @param testData The data resulting from running the test.
     */
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: TestResultBundle,
    ): BeaconData

    /**
     * A hook enabling providers to determine the beacon URL for a test.
     * result.
     * @param testConfig The test configuration.
     */
    makeBeaconURL(testConfig: TestConfiguration): string

    /**
     * A hook enabling providers to generate a test URL at runtime.
     * @remarks
     * A provider may cache the result of the first call to this method and
     * reuse the value on subsequent calls.
     * @param testConfig The test configuration, which usually specifies a base
     * URL from which the provider produces the runtime URL.
     */
    getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * A hook enabling providers to specify a set of zero or more HTTP request
     * headers to be sent with the test.
     * @param testConfig The test configuration.
     */
    getResourceRequestHeaders(
        testConfig: TestConfiguration,
    ): Record<string, string>

    /**
     * A hook enabling providers to handle an error emitted by the core
     * module.
     * @param errorType
     * @param innerError
     */
    handleError(errorType: KnownErrors, innerError: Error): void

    /**
     * A hook enabling providers to perform encoding of beacon data before
     * sending it, such as `JSON.stringify()` or other serialization methods.
     * @param testConfig The test configuration.
     * @param data The data to be encoded.
     */
    encodeBeaconData(testConfig: TestConfiguration, data: BeaconData): string

    /**
     * Called when the Promise returned by {@link sendBeacon} is rejected.
     * @param error An error describing the problem.
     */
    onSendBeaconRejected(error: Error): void

    /**
     * Called when the Promise returned by {@link sendBeacon} is resolved.
     * @param result The Response object in case the Fetch API was used, or
     * `void` if the Beacon API was used.
     */
    onSendBeaconResolved(result: SendBeaconResult): void

    /**
     * A hook enabling providers to report test results, i.e. "beaconing".
     * @param testConfig The test configuration.
     * @param encodedBeaconData The beacon payload returned from
     * {@link Provider.encodeBeaconData}.
     */
    sendBeacon(
        testConfig: TestConfiguration,
        encodedBeaconData: string,
    ): Promise<SendBeaconResult>
}

/**
 * A function that takes an array of {@link SessionConfig} objects and returns
 * a Promise<{@link SessionResult}>.
 *
 * @remarks
 * In general, the list of {@link SessionConfig} objects passed into this
 * function would be the result of previous calls to
 * {@link Provider.fetchSessionConfig} for each provider used by the client.
 *
 * The tag owner may override the default sequencing function in order to
 * control the order in which tests run.
 *
 * @param sessionConfigs List of session configurations for which to
 * generate a list of Promise<{@link SessionResult}> objects.
 */
export type SessionProcessFunc = (
    sessionConfigs: SessionConfig[],
) => Promise<SessionResult>

/**
 * Used by the tag owner to pass settings to the client at runtime. In general,
 * these settings affect core module behavior at the page level. For example,
 * the site might pass different settings to the client on one page than it
 * does on another.
 */
export interface ClientSettings {
    /**
     * The approximate delay (in milliseconds) after {@link init} is called
     * before the RUM session should begin.
     */
    preConfigStartDelay?: number
    /**
     * An array of objects implementing {@link Provider}. When {@link init} is
     * called, these providers will participate in the RUM session.
     */
    providers: Provider[]
    /**
     * At runtime, this function takes the list of {@link SessionConfig}
     * objects supplied by providers participating in the RUM session
     * and executes any tests they contain.
     *
     * @remarks
     * Defaults to {@link defaultSequenceFunc}
     */
    sessionProcess?: SessionProcessFunc
}
