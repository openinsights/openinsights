import * as Beacon from '../lib/beacon'
export interface FetchResponse {
    json(): Promise<any>
}

export interface SessionConfig {
    getExpandedTasks(): Executable[]
    setExpandedTasks(value: Executable[]): void
}

export interface TestConfiguration {
    type: string
}

export interface TestSetupResult {
    data: {
        [key: string]: any
    }
}

export interface ResourceTimingEntry {
    [key: string]: string | number
}

export interface Result {
    [key: string]: any
}

export interface ResultBundle {
    testType: string
    data: Result[]
    setupResult: TestSetupResult
}

export interface ClientInfo {
    [key: string]: string | number | Date
}

// NetworkInformation
// ---------------------------------------------------------------------------
/// W3C Spec Draft http://wicg.github.io/netinfo/
// Edition: Draft Community Group Report 20 February 2019

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
/* eslint-disable @typescript-eslint/no-empty-interface */
export declare interface Navigator extends NavigatorNetworkInformation { }
declare interface WorkerNavigator extends NavigatorNetworkInformation { }
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
    execute(): Promise<Beacon.Data>
}

export interface Provider {
    name: any
    sessionConfig?: SessionConfig

    /**
     * Called before a test begins, giving the provider an opportunity to perform any pre-test setup that it would like to do, such as record a timestamp.
     * @param config The configuration object of the test about to start
     */
    testSetup(config: TestConfiguration): Promise<TestSetupResult>

    setSessionConfig(value: SessionConfig): void
    shouldRun(): boolean
    fetchSessionConfig(): Promise<SessionConfig>
    expandTasks(): Executable[]
    createTestResult(timingEntry: ResourceTimingEntry, response: Response, testConfig: unknown, setupResult: TestSetupResult): Promise<ResultBundle>
    makeBeaconData(testConfig: unknown, testData: ResultBundle): Beacon.Data
    makeFetchBeaconURL(testConfig: unknown): string
    getResourceUrl(config: unknown): string
    encodeBeaconData(testConfig: unknown, data: Beacon.Data): string
    sendBeacon(testConfig: unknown, encodedBeaconData: string): void
}

export type PromiseSequenceFunc = (sessionConfigs: SessionConfig[]) => Promise<unknown>

export type ClientInfoResponseFunc = (response: Promise<any>) => Promise<ClientInfo>

export type ResourceTimingEntryValidationPredicate = (entry: ResourceTimingEntry) => boolean

export interface ClientSettings {
    preConfigStartDelay?: number
    providers: Provider[]
    sequence: PromiseSequenceFunc
}
