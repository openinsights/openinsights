import { Executable, ExecutableContainer, TestResultBundle } from "../@types"
import { Data } from "../lib/beacon"
import ProviderBase from "../lib/providerBase"

export default class UnitTestProvider extends ProviderBase {
    fetchSessionConfig(): Promise<ExecutableContainer> {
        throw new Error("Method not implemented.")
    }
    expandTasks(): Executable[] {
        throw new Error("Method not implemented.")
    }
    createFetchTestResult(): Promise<TestResultBundle> {
        throw new Error("Method not implemented.")
    }
    makeBeaconData(): Data {
        throw new Error("Method not implemented.")
    }
    getResourceUrl(): URL {
        throw new Error("Method not implemented.")
    }
    getResourceRequestHeaders(): Record<string, string> {
        throw new Error("Method not implemented.")
    }
    handleError(): void {
        throw new Error("Method not implemented.")
    }
    shouldRun(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
}
