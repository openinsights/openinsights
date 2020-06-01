import { ProviderInterface, TaskInterface, SessionConfig, ResourceTimingEntry } from "../@types"
import { beacon } from "../util/beacon"

export default abstract class ProviderBase implements ProviderInterface {
    sessionConfig?: SessionConfig

    abstract name: string
    abstract fetchSessionConfig(): Promise<SessionConfig>
    abstract expandTasks(): TaskInterface[]
    abstract makeBeaconData(testConfig: unknown, testData: unknown): unknown
    abstract getResourceUrl(config: unknown): string
    abstract makeFetchBeaconURL(testConfig: unknown): string
    abstract createFetchResult(timing: ResourceTimingEntry, id: string, testConfig: unknown): ResourceTimingEntry

    sendBeacon(testConfig: unknown, encodedBeaconData: string): void {
        beacon(this.makeFetchBeaconURL(testConfig), encodedBeaconData)
    }

    shouldRun(): boolean {
        return true
    }

    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    makeClientInfoPromise(task: TaskInterface): Promise<unknown> {
        return Promise.resolve<unknown>(null)
    }
}
