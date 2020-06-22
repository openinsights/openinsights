import * as Beacon from "../lib/beacon"

/**
 * TODO
 */
export interface SimpleObject {
    [key: string]: string | number
}

/**
 * TODO
 */
export interface SessionConfig {
    getExpandedTasks(): Executable[]
    setExpandedTasks(value: Executable[]): void
}

/**
 * TODO
 */
export interface TestConfiguration {
    type: string
}

/**
 * TODO
 */
export interface TestSetupResult {
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
    beaconData?: Beacon.Data
    testType: string
    data: Result[]
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
    testResults: ResultBundle[]
}

/**
 * Alias for a tuple representing an HTTP header name and value.
 */
export type HttpHeader = [string, string]

// NetworkInformation
// ---------------------------------------------------------------------------
/// W3C Spec Draft http://wicg.github.io/netinfo/
// Edition: Draft Community Group Report 20 February 2019

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
/* eslint-disable @typescript-eslint/no-empty-interface */
export declare interface Navigator extends NavigatorNetworkInformation {}
declare interface WorkerNavigator extends NavigatorNetworkInformation {}
/* eslint-enable @typescript-eslint/no-empty-interface */

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
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
     * TODO
     */
    testTearDown(testData: ResultBundle): Promise<ResultBundle>

    /**
     * TODO
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
     */
    createTestResult(
        timingEntry: ResourceTimingEntry,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<ResultBundle>

    /**
     * TODO
     */
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data

    /**
     * TODO
     */
    makeFetchBeaconURL(testConfig: TestConfiguration): string

    /**
     * TODO
     */
    getResourceUrl(testConfig: TestConfiguration): URL

    /**
     * TODO
     */
    getResourceRequestHeaders(testConfig: TestConfiguration): HttpHeader[]

    /**
     * TODO
     */
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string

    /**
     * TODO
     */
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void
}

/**
 * Alias for a function that takes an array of {@link SessionConfig} objects
 * and returns a promise resolving to a {@link SessionResult} object. The tag
 * own may override the default sequencing function in order to control the
 * order in which tests run.
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
     * TODO
     */
    preConfigStartDelay?: number
    /**
     * TODO
     */
    providers: Provider[]
    /**
     * TODO
     */
    sequence: PromiseSequenceFunc
}
