import { Provider, Executable, SessionConfig, ResourceTimingEntry } from "../@types"
import { beacon } from "../util/beacon"

export default abstract class ProviderBase implements Provider {
    sessionConfig?: SessionConfig

    abstract name: string
    abstract fetchSessionConfig(): Promise<SessionConfig>
    abstract expandTasks(): Executable[]
    abstract makeBeaconData(testConfig: unknown, testData: unknown): unknown
    abstract getResourceUrl(config: unknown): string
    abstract createFetchResult(timing: ResourceTimingEntry, id: string, testConfig: unknown): ResourceTimingEntry
    abstract shouldRun(): boolean

    sendBeacon(testConfig: unknown, encodedBeaconData: string): void {
        beacon(this.makeFetchBeaconURL(testConfig), encodedBeaconData)
    }

    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    makeClientInfoPromise(task: Executable): Promise<unknown> {
        return Promise.resolve<unknown>(null)
    }

    /**
     * A subclass might not override this if it overrides ProviderBase::sendBeacon instead
     * @param testConfig
     */
    makeFetchBeaconURL(testConfig: unknown): string {
        throw new Error("Method not implemented.")
    }

    markTestStart(config: unknown): void {
        // Do nothing
    }

    /**
     * A subclass overrides this if it wants to obtain the value of any fetch response headers
     * @param headers
     */
    getFetchHeaders(headers: Headers, testConfig: unknown): string {
        return ''
    }
}
