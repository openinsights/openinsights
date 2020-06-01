import { FetchBase } from "./fetchBase"

export default class Fetch extends FetchBase {
    makeBeaconURL(): string {
        return this.provider.makeFetchBeaconURL(this.config)
    }
}
