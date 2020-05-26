import { FetchResult, FetchBeaconData, FetchConfig } from "../lib/fetch"

export interface FetchResponse {
    json(): Promise<any>
}

interface QueryParameters {
    [key: string]: string
}

//  Classifiers
// ---------------------------------------------------------------------------
export type CountryCode = string
export type ASN = number
export type ConnectionType = string
export type DeviceType = string

//  Server response
// ---------------------------------------------------------------------------

export interface Test {
    id: string
}

interface Agent {
    hasFeatureSupport: boolean
}

export interface Client {
    countryCode: CountryCode
    connectionType: ConnectionType
    asn: ASN
    deviceType: DeviceType
    [key: string]: string | number
}

export interface Host {
    host: string
    lookup: string
}

export interface Settings {
    initialDelay: number
    maxTasks: number
    reportErrors: boolean
    sampleRate: number
    token: string
}

interface Server {
    datacenter: string
}

export interface SessionConfig {
    client?: Client
    hosts?: Host
    server?: Server
    session?: string
    settings?: Settings
    tasks: TaskInterface[]
    taskConfigs: unknown[]
    test?: Test
}

// Result / ClientInfo / Beacon
// ---------------------------------------------------------------------------
export interface ClientInfo {
    client_asn: number
    client_conn_speed: string
    client_continent_code: string
    client_country_code: string
    client_gmt_offset: string
    client_ip: string
    client_latitude: string
    client_longitude: string
    client_metro_code: string
    client_postal_code: string
    client_region: string
    client_user_agent: string
    resolver_asn: number
    resolver_conn_speed: string
    resolver_continent_code: string
    resolver_country_code: string
    resolver_ip: string
    resolver_region: string
    resolver_latitude: string
    resolver_longitude: string
}

interface TaskResult {
    test_id: string
    task_schema_version: string
    task_server_data: string
    task_type: string
    test_api_key: string
    task_id: string
    test_lib_version: string
    test_server: string
    test_timestamp: number
    task_client_data: string
}

interface TestResult {
    [key: string]: any
}

export interface ResourceTimingEntry {
    [key: string]: string | number
}

export type BeaconData = ClientInfo & TaskResult

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
    getCurrentTestId(): string | undefined
    setSessionConfig(value: SessionConfig): void
    makeClientInfoPromise(task: TaskInterface): Promise<ClientInfo>
    shouldRun(): boolean
    fetchSessionConfig(): Promise<SessionConfig>
    expandTasks(): void
    createFetchResult(timing: ResourceTimingEntry, id: string, taskConfig: unknown): ResourceTimingEntry
    makeFetchBeaconData(config: FetchConfig, testResult: FetchResult, clientInfo: ClientInfo): FetchBeaconData
    makeFetchBeaconURL(sessionConfig: SessionConfig): string
}

export interface PromiseSequenceFunc {
    (sessionConfigs: SessionConfig[]): void
}

export interface ClientSettings {
    preConfigStartDelay?: number
    providers: ProviderInterface[]
    sequence: PromiseSequenceFunc
}
