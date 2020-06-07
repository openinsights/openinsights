import { TestBase } from "./testBase"
import { ResourceTimingEntry } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"

export default class Fetch extends TestBase {
    makeBeaconURL(): string {
        return this.provider.makeFetchBeaconURL(this.config)
    }

    getResourceUrl(): string {
        return this.provider.getResourceUrl(this.config)
    }

    makeTestSteps(): Promise<unknown[]> {
        this.provider.markTestStart(this.config)
        return Promise.all<unknown>([
            this.test(),
            this.provider.makeClientInfoPromise(this),
        ])
    }

    test(): Promise<ResourceTimingEntry> {
        return Promise.all<Response, ResourceTimingEntry>([
            this.fetchObject(),
            asyncGetEntry(this.getResourceUrl(), 5000)
        ])
            .then(
                ([response, entry]): ResourceTimingEntry => {
                    const timing = normalizeEntry(entry)
                    return this.provider.createFetchResult(timing, response, this.config)
                }
            )
    }

    fetchObject(): Promise<Response> {
        return fetch(this.getResourceUrl())
    }
}
