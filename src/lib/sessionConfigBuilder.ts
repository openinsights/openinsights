import { Host, SessionConfig, Settings } from "../@types"

export default class SessionConfigBuilder {
    private data: SessionConfig = {
        tasks: [],
        taskConfigs: [],
    }
    addHosts(value: Host) {
        this.data.hosts = value
    }
    addSettings(value: Settings) {
        this.data.settings = value
    }
    toSessionConfig(): SessionConfig {
        return this.data
    }
}
