import { FetchBase } from "./fetchBase"
import { ProviderInterface } from "../@types"

export default class FetchThroughput extends FetchBase {
    constructor(provider: ProviderInterface, protected fetchConfig: unknown) {
        super(provider)
        // this.fetchConfig.resource = templateResource(this.fetchConfig.resource, this.provider.sessionConfig as SessionConfig)
    }
    getResourceUrl(): string {
        throw new Error("Method not implemented.")
    }
    makeTestSteps(): Promise<unknown[]> {
        throw new Error("Method not implemented.")
    }
    makeBeaconURL(): string {
        throw new Error("Method not implemented.")
    }
    returnBeacon(): unknown {
        throw new Error("Method not implemented.")
    }
    // makeBeaconData(testResult: FetchResult, clientInfo: ClientInfo): FetchThroughputBeaconData {
    //     // const result: FetchThroughputBeaconData = this.provider.makeFetchBeaconData(this.fetchConfig, testResult, clientInfo)
    //     // this.beaconData = result
    //     // return result
    //     return {}
    // }
}
