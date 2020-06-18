import * as Beacon from "../lib/beacon"

export interface SimpleObject {
    [key: string]: string | number
}

export interface SessionConfig {
    getExpandedTasks(): Executable[]
    setExpandedTasks(value: Executable[]): void
}

export interface TestConfiguration {
    type: string
}

export interface TestSetupResult {
    data?: {
        [key: string]: string | number | Date
    }
}

export type ResourceTimingEntry = SimpleObject

export interface Result {
    [key: string]: string | number | Date
}

export interface ResultBundle {
    beaconData?: Beacon.Data
    testType: string
    data: Result[]
    setupResult: TestSetupResult
}

export interface ClientInfo {
    [key: string]: string | number | Date
}

export interface SessionResult {
    testResults: ResultBundle[]
}

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

// http://wicg.github.io/netinfo/#connection-types
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

// http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g"

// http://wicg.github.io/netinfo/#dom-megabit
type Megabit = number
// http://wicg.github.io/netinfo/#dom-millisecond
type Millisecond = number

export interface NetworkInformation {
    [key: string]:
        | NetworkConnectionType
        | EffectiveConnectionType
        | Megabit
        | Millisecond
        | boolean
}

export interface Executable {
    execute(): Promise<ResultBundle>
}

export interface Provider {
    name: string
    sessionConfig?: SessionConfig

    /**
     * Called before a test begins, giving the provider an opportunity to
     * perform any pre-test setup that it would like to do, such as record a
     * timestamp.
     * @param config The configuration object of the test about to start
     */
    testSetUp(config: TestConfiguration): Promise<TestSetupResult>
    testTearDown(testData: ResultBundle): Promise<ResultBundle>

    setSessionConfig(value: SessionConfig): void
    shouldRun(): boolean
    fetchSessionConfig(): Promise<SessionConfig>
    expandTasks(): Executable[]
    createTestResult(
        timingEntry: ResourceTimingEntry,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<ResultBundle>
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: ResultBundle,
    ): Beacon.Data
    makeFetchBeaconURL(testConfig: TestConfiguration): string
    getResourceUrl(testConfig: TestConfiguration): URL
    getResourceRequestHeaders(testConfig: TestConfiguration): HttpHeader[]
    encodeBeaconData(testConfig: TestConfiguration, data: Beacon.Data): string
    sendBeacon(testConfig: TestConfiguration, encodedBeaconData: string): void
}

export type PromiseSequenceFunc = (
    sessionConfigs: SessionConfig[],
) => Promise<SessionResult>

export type ClientInfoResponseFunc = (
    response: Promise<SimpleObject>,
) => Promise<ClientInfo>

export type ResourceTimingEntryValidationPredicate = (
    entry: ResourceTimingEntry,
) => boolean

/**
 * Used by the tag owner to pass settings to the client at runtime. In general,
 * these settings affect core module behavior at the page level. For example,
 * the site might pass different settings to the client on one page than it
 * does on another.
 */
export interface ClientSettings {
    preConfigStartDelay?: number
    providers: Provider[]
    sequence: PromiseSequenceFunc
}
