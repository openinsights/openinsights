import { FetchBase } from "./fetchBase"
import { ProviderInterface } from "../@types"
// import templateResource from "./templateResource"

// interface FetchClassification {
//     countryCode?: CountryCode[]
//     asn?: ASN[]
//     connectionType?: ConnectionType[]
//     deviceType?: DeviceType[]
//     [key: string]: string[] | number[] | undefined
// }

export interface FetchConfig {
    resourceUrl: string
}
// export interface FetchConfig {
//     id: string
//     requestHeader?: string
//     resource: string
//     responseHeaders?: string[]
//     type: string
//     weight?: number
//     classification?: FetchClassification
// }

// export interface FetchThroughputConfig {
//     id: string
//     resource: string
// }

export interface FetchResult {

}

export interface FetchBeaconData {

}

export default class Fetch extends FetchBase {
    constructor(provider: ProviderInterface, protected fetchConfig: FetchConfig) {
        super(provider)
    }
    getResourceUrl(): string {
        return this.fetchConfig.resourceUrl
    }
    // makeBeaconData(testResult: FetchResult, clientInfo: ClientInfo): FetchBeaconData {
    //     const result: FetchBeaconData = this.provider.makeFetchBeaconData(this.fetchConfig, testResult, clientInfo)
    //     this.beaconData = result
    //     return result
    // }
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
