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
        return Promise.all<string, ResourceTimingEntry>([
            this.fetchObjectAndId(),
            asyncGetEntry(this.getResourceUrl(), 5000)
        ])
            .then(
                ([id, entry]): ResourceTimingEntry => {
                    const timing = normalizeEntry(entry)
                    return this.provider.createFetchResult(timing, id, this.config)
                }
            )
    }

    fetchObjectAndId(): Promise<string> {
        return fetch(this.getResourceUrl())
            .then((res): string => {
                return res.headers.get("X-Datacenter") || ""
            })
    }
}
