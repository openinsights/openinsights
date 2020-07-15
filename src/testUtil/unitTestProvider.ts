/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Executable,
    ExecutableContainer,
    HttpHeader,
    SimpleObject,
    TestConfiguration,
    TestResultBundle,
    TestSetupResult,
} from "../@types"
import { Data } from "../lib/beacon"
import ProviderBase from "../lib/providerBase"

export default class UnitTestProvider extends ProviderBase {
    fetchSessionConfig(): Promise<ExecutableContainer> {
        throw new Error("Method not implemented.")
    }
    expandTasks(): Executable[] {
        throw new Error("Method not implemented.")
    }
    createFetchTestResult(
        timingEntry: SimpleObject,
        response: Response,
        testConfig: TestConfiguration,
        setupResult: TestSetupResult,
    ): Promise<TestResultBundle> {
        throw new Error("Method not implemented.")
    }
    makeBeaconData(
        testConfig: TestConfiguration,
        testData: TestResultBundle,
    ): Data {
        throw new Error("Method not implemented.")
    }
    getResourceUrl(testConfig: TestConfiguration): URL {
        throw new Error("Method not implemented.")
    }
    getResourceRequestHeaders(testConfig: TestConfiguration): HttpHeader[] {
        throw new Error("Method not implemented.")
    }
    shouldRun(): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
}
