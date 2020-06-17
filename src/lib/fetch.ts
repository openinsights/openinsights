import { Test } from "./test"
import { ResourceTimingEntry, ResultBundle, ResourceTimingEntryValidationPredicate, Provider, TestConfiguration } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"

export default class Fetch extends Test {

    constructor(provider: Provider, config: TestConfiguration,
        private isValidEntryFunc: ResourceTimingEntryValidationPredicate =
            (e) => e.requestStart !== 0 && e.connectStart !== e.connectEnd) {
        super(provider, config)
    }

    test(): Promise<ResultBundle> {
        return this.provider.testSetup(this.config)
            .then((setupResult) => {
                return Promise.all<Response, ResourceTimingEntry>([
                    this.fetchObject(),
                    asyncGetEntry(this.getResourceUrl().href, 5000, this.isValidEntryFunc),
                ]).then(([response, entry]): Promise<ResultBundle> => {
                    return this.provider.createTestResult(normalizeEntry(entry), response, this.config, setupResult)
                })
            })
    }

    makeBeaconURL(): string {
        return this.provider.makeFetchBeaconURL(this.config)
    }

    getResourceUrl(): URL {
        return this.provider.getResourceUrl(this.config)
    }

    fetchObject(): Promise<Response> {
        return fetch(this.getResourceUrl().href)
    }
}
