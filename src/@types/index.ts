import * as Beacon from "../lib/beacon"

/**
 * An interface representing simple objects mapping strings to basic primative
 * types.
 */
export interface SimpleObject {
    [key: string]: boolean | number | string | null | undefined
}

/**
 * TODO
 */
export interface SessionConfig {
    /**
     * TODO
     */
    getExpandedTasks(): Executable[]
    /**
     * TODO
     */
    setExpandedTasks(value: Executable[]): void
}

/**
 * TODO
 */
export interface TestConfiguration {
    /**
     * TODO
     */
    type: string
}

/**
 * TODO
 */
export interface TestSetupResult {
    /**
     * TODO
     */
    data?: {
        [key: string]: string | number | Date
    }
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
     * TODO
     */
    name: string

    /**
     * TODO
     */
    sessionConfig?: SessionConfig

    /**
     * Called before a test begins, giving the provider an opportunity to
     * perform any pre-test setup that it would like to do, such as record a
     * timestamp.
     * @param config The configuration object of the test about to start
     */
    testSetUp(config: TestConfiguration): Promise<TestSetupResult>

    /**
     *
     * @param testData
     */
    testTearDown(testData: ResultBundle): Promise<ResultBundle>

    /**
     *
     * @param value
     */
    setSessionConfig(value: SessionConfig): void

    /**
     * TODO
     */
    shouldRun(): boolean

    /**
     * TODO
     */
    fetchSessionConfig(): Promise<SessionConfig>

    /**
     * TODO
     */
    expandTasks(): Executable[]

    /**
     * TODO
     * @param timingEntry TODO
     * @param response TODO
     * @param testConfig TODO
     * @param setupResult TODO
     */
    createTestResult(
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
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data

    /**
     * TODO
     * @param testConfig TODO
     */
    makeFetchBeaconURL(testConfig: TestConfiguration): string

    /**
     * TODO
     * @param testConfig TODO
     */
    getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * TODO
     * @param testConfig TODO
     */
    getResourceRequestHeaders(testConfig: TestConfiguration): HttpHeader[]

    /**
     * TODO
     * @param testConfig TODO
     * @param data TODO
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string

    /**
     * TODO
     * @param testConfig TODO
     * @param encodedBeaconData TODO
     */
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void
}

/**
 *
 */

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
