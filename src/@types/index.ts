import * as Beacon from "../lib/beacon"

/**
 * An interface representing simple objects mapping strings to basic primative
 * types.
 */
export interface SimpleObject {
    [key: string]: boolean | number | string | null | undefined
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
 * A type representing a Resource Timing API entry having _entryType_
 * "resource".
 *
 * Alias for {@link SimpleObject}
 */
export type ResourceTimingEntry = SimpleObject

/**
 * An alias for a boolean-returning function that evaluates whether a Resource
 * Timing entry is valid. Used by
 * {@link "index".lib.resourceTiming.getValidEntry} to assess validity of an
 * entry. Providers may override the default predicate.
 */
export type ResourceTimingEntryValidationPredicate = (
    entry: ResourceTimingEntry,
) => boolean

/**
 * TODO
 */
export interface Result {
    [key: string]: string | number | Date
}

/**
 * TODO
 */
export interface ResultBundle {
    /**
     * TODO
     */
    beaconData?: Beacon.Data
    /**
     * TODO
     */
    testType: string
    /**
     * TODO
     */
    data: Result[]
    /**
     * TODO
     */
    setupResult: TestSetupResult
}

/**
 * Interface representing the return value of a "client info request". This
 * type of request is typically made in order to capture the client's resolver
 * geo.
 * See {@link clientInfo.getClientInfo}.
 */
export interface ClientInfo {
    [key: string]: string | number | Date
}

/**
 * TODO
 */
export interface SessionResult {
    /**
     * TODO
     */
    testResults: ResultBundle[]
}

/**
 * Alias for a tuple representing an HTTP header name and value.
 */
export type HttpHeader = [string, string]

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
 * TODO
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
 * TODO
 */
export interface Executable {
    /**
     * TODO
     */
    execute(): Promise<ResultBundle>
}

/**
 * TODO
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
    testTearDown(testData: ResultBundle): Promise<ResultBundle>

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
     * It returns a promise, in case a provider would like to make a network
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
    ): Promise<ResultBundle>

    /**
     * @remarks
     * A provider implements this in order to create a beacon payload.
     * @param testConfig The test configuration.
     * @param testData The data resulting from running the test.
     */
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data

    /**
     * A hook enabling a provider to determine the beacon URL for a test
     * result.
     * @param testConfig The test configuration.
     */
    makeBeaconURL(testConfig: TestConfiguration): string

    /**
     * A hook enabling a provider to generate a test URL at runtime.
     * @remarks
     * A provider may cache the result of the first call to this method and
     * reuse the value on subsequent calls.
     * @param testConfig The test configuration, which usually specifies a base
     * URL from which the provider produces the runtime URL.
     */
    getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * A hook enabling a provider to draw a set of zero or more
     * {@link HttpHeader} tuples from a provider-defined test configuration.
     * @param testConfig The test configuration.
     */
    getResourceRequestHeaders(testConfig: TestConfiguration): HttpHeader[]

    /**
     * A hook enabling a provider to perform encoding of beacon data before
     * sending it.
     * @param testConfig The test configuration.
     * @param data The data to be encoded.
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string

    /**
     * A hook enabling a provider to report test results, i.e. "beaconing".
     * @param testConfig The test configuration.
     * @param encodedBeaconData The beacon payload returned from
     * {@link Provider.encodeBeaconData}.
     */
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void
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
export type PromiseSequenceFunc = (
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
     * objects supplied by the providers participating in the RUM session
     * and determines the order in which their tests run.
     *
     * @remarks
     * Defaults to {@link defaultSequenceFunc}
     */
    sequence: PromiseSequenceFunc
}
