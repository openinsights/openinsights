export interface FetchResponse {
    json(): Promise<any>
}

export interface SessionConfig {
    getExpandedTasks(): TaskInterface[]
    setExpandedTasks(value: TaskInterface[]): void
}

export interface ResourceTimingEntry {
    [key: string]: string | number
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

export interface TaskInterface {
    execute(): Promise<unknown>
}

export interface ProviderInterface {
    name: any
    sessionConfig?: SessionConfig
    markTestStart(config: unknown): void
    setSessionConfig(value: SessionConfig): void
    makeClientInfoPromise(task: TaskInterface): Promise<unknown>
    shouldRun(): boolean
    fetchSessionConfig(): Promise<SessionConfig>
    expandTasks(): TaskInterface[]
    createFetchResult(timing: ResourceTimingEntry, id: string, testConfig: unknown): ResourceTimingEntry
    makeBeaconData(testConfig: unknown, testData: unknown): unknown
    makeFetchBeaconURL(testConfig: unknown): string
    getResourceUrl(config: unknown): string
    sendBeacon(testConfig: unknown, encodedBeaconData: string): void
}

export interface PromiseSequenceFunc {
    (sessionConfigs: SessionConfig[]): Promise<unknown>
}

export interface ClientInfoResponseFunc {
    (response: Promise<any>): Promise<unknown>
}

export interface ClientSettings {
    preConfigStartDelay?: number
    providers: ProviderInterface[]
    sequence: PromiseSequenceFunc
}
