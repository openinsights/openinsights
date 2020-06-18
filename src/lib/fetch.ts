import { HttpHeader, Provider, ResourceTimingEntry, ResourceTimingEntryValidationPredicate, ResultBundle, TestConfiguration, TestSetupResult } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"
import { Test } from "./test"

export default class Fetch extends Test {

    constructor(provider: Provider, config: TestConfiguration,
        private isValidEntryFunc: ResourceTimingEntryValidationPredicate =
            (e) => e.requestStart !== 0 && e.connectStart !== e.connectEnd) {
        super(provider, config)
    }

    test(setupResult: TestSetupResult): Promise<ResultBundle> {
        return Promise.all<Response, ResourceTimingEntry>([
            this.fetchObject(),
            asyncGetEntry(this.getResourceUrl().href, 5000, this.isValidEntryFunc)
        ]).then(([response, entry]): Promise<ResultBundle> => {
            return this.provider.createTestResult(normalizeEntry(entry), response, this.config, setupResult)
        })
    }

    makeBeaconURL(): string {
        return this.provider.makeFetchBeaconURL(this.config)
    }

    getResourceUrl(): URL {
        return this.provider.getResourceUrl(this.config)
    }

    fetchObject(): Promise<Response> {
        const init: RequestInit = {}
        const requestHeaders: [string, string][] = this.provider.getResourceRequestHeaders(this.config)
        if (requestHeaders.length) {
            init.headers = requestHeaders.reduce((accumulator: { [key: string]: string }, currentValue: HttpHeader) => {
                accumulator[currentValue[0]] = currentValue[1]
                return accumulator
            }, {})
        }
        const request = new Request(this.getResourceUrl().href, init)
        return fetch(request)
    }
}
