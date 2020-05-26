import { TestBase } from "./testBase"
import { ResourceTimingEntry } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"

export abstract class FetchBase extends TestBase {
    abstract getResourceUrl(): string
    makeTestSteps(): Promise<unknown[]> {
        return Promise.all<unknown>([
            this.test(),
            this.provider.makeClientInfoPromise(this),
        ])
    }
    test(): Promise<ResourceTimingEntry> {
        return Promise.all<string, ResourceTimingEntry>([
            this.fetchObjectAndId(),
            asyncGetEntry(this.getResourceUrl(), 1000)
        ])
            .then(
                ([id, entry]): ResourceTimingEntry => {
                    throw new Error('Not implemented')
                    // const timing = normalizeEntry(entry)
                    // return this.provider.createFetchResult(timing, id, this.fetchConfig)
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
