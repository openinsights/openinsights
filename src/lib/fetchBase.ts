import { TestBase } from "./testBase"
import { ResourceTimingEntry } from "../@types"
import { asyncGetEntry, normalizeEntry } from "./resourceTiming"

export abstract class FetchBase extends TestBase {
    createFetchResult(timing: ResourceTimingEntry, id: string): ResourceTimingEntry {
        return this.provider.createFetchResult(timing, id, this.config)
    }

    getResourceUrl(): string {
        return this.provider.getResourceUrl(this.config)
    }

    makeTestSteps(): Promise<unknown[]> {
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
                    return this.createFetchResult(timing, id)
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
