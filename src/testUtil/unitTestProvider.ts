import {
    BeaconData,
    Executable,
    ExecutableContainer,
    TestResultBundle,
} from "../@types"
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
    makeBeaconData(): BeaconData {
        throw new Error("Method not implemented.")
    }
    getResourceUrl(): string {
        throw new Error("Method not implemented.")
    }
    getResourceRequestHeaders(): Record<string, string> {
        throw new Error("Method not implemented.")
    }
    handleError(): void {
        throw new Error("Method not implemented.")
    }
    shouldRun(): boolean {
        throw new Error("Method not implemented.")
    }
}
