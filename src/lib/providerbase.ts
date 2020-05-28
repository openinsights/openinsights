import { ProviderInterface, TaskInterface, SessionConfig, ResourceTimingEntry } from "../@types"
// import assign from "../util/assign"
// import prefixKeys from "../util/prefixKeys"
// import { FetchResult, FetchBeaconData } from "./fetch"
// import getNetworkInformation from "./getNetworkInformation"

export default abstract class ProviderBase implements ProviderInterface {
    sessionConfig?: SessionConfig

    abstract name: string
    abstract makeClientInfoPromise(task: TaskInterface): Promise<unknown>
    abstract fetchSessionConfig(): Promise<SessionConfig>
    abstract expandTasks(): TaskInterface[]
    abstract makeBeaconData(testConfig: unknown, testData: unknown): unknown

    shouldRun(): boolean {
        return true
    }

    setSessionConfig(value: SessionConfig): void {
        this.sessionConfig = value
    }

    // /**
    //  * Subclasses override this method to create an object with the expected structure
    //  * @param timing
    //  * @param id
    //  * @param taskConfig
    //  */
    // createFetchResult(timing: ResourceTimingEntry, id: string, taskConfig: FetchConfig): ResourceTimingEntry {
    //     if (taskConfig.type === 'pop') {
    //         const meta = { id, attempted_id: taskConfig.id }
    //         return prefixKeys(assign(meta, timing), "subject_")
    //     }
    //     return prefixKeys(assign({ id }, timing), "subject_")
    // }

    // makeFetchBeaconData(config: FetchConfig, testResult: FetchResult, clientInfo: ClientInfo): FetchBeaconData
    // {
    //     const { test, settings, server } = this.sessionConfig as SessionConfig
    //     const networkInformation = getNetworkInformation()
    //     const result = assign(
    //         { client_connection: networkInformation },
    //         testResult
    //     )
    //     return assign(
    //         {
    //             test_id: test ? test.id : 'unknown',
    //             test_api_key: settings ? settings.token : 'unknown',
    //             // test_lib_version: VERSION,
    //             test_lib_version: '0.0.0', // need to make this dynamic
    //             test_server: JSON.stringify(server),
    //             test_timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    //             task_type: config.type,
    //             task_id: config.id,
    //             task_schema_version: "0.0.0",
    //             task_client_data: JSON.stringify(result),
    //             task_server_data: "<% SERVER_DATA %>"
    //         },
    //         clientInfo
    //     )
    // }

    abstract makeFetchBeaconURL(sessionConfig: SessionConfig): string
    // {
    //     if (!sessionConfig.hosts) {
    //         throw new Error('Session config missing hosts property')
    //     }
    //     if (!sessionConfig.settings) {
    //         throw new Error('Session config missing settings property')
    //     }
    //     const {
    //         session,
    //         settings,
    //         hosts: { host }
    //     } = sessionConfig
    //     return `https://${host}/b?k=${settings.token}&s=${session}`
    // }

    createFetchResult(timing: ResourceTimingEntry, id: string, taskConfig: unknown): ResourceTimingEntry {
        throw new Error("Method not implemented.")
    }
}
