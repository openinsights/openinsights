import { FetchBase } from "./fetchBase"
import { ResourceTimingEntry, CountryCode, ASN, ConnectionType, DeviceType, ProviderInterface, SessionConfig, ClientInfo } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"
import templateResource from "./templateResource"

interface FetchClassification {
    countryCode?: CountryCode[]
    asn?: ASN[]
    connectionType?: ConnectionType[]
    deviceType?: DeviceType[]
    [key: string]: string[] | number[] | undefined
}

export interface FetchConfig {
    id: string
    requestHeader?: string
    resource: string
    responseHeaders?: string[]
    type: string
    weight?: number
    classification?: FetchClassification
}

export interface FetchThroughputConfig {
    id: string
    resource: string
}

export interface FetchResult {

}

export interface FetchBeaconData {

}

export default class Fetch extends FetchBase {
    protected beaconData?: FetchBeaconData
    constructor(provider: ProviderInterface, protected fetchConfig: FetchConfig) {
        super(provider)
        this.fetchConfig.resource = templateResource(this.fetchConfig.resource, this.provider.sessionConfig as SessionConfig)
    }
    getResourceUrl(): string {
        return this.fetchConfig.resource
    }
    makeBeaconData(testResult: FetchResult, clientInfo: ClientInfo): FetchBeaconData {
        const result: FetchBeaconData = this.provider.makeFetchBeaconData(this.fetchConfig, testResult, clientInfo)
        this.beaconData = result
        return result
    }
    makeBeaconURL(): string {
        if (this.provider.sessionConfig) {
            return this.provider.makeFetchBeaconURL(this.provider.sessionConfig)
        }
        throw new Error('Provider session config not assigned')
    }

    returnBeacon(): unknown {
        return this.beaconData
    }
}
