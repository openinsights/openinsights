import whenReady from "./util/loadWhenDocumentReady"
import { ClientSettings, SessionResult } from "./@types"

export default function init(settings: ClientSettings): Promise<SessionResult> {
    return whenReady()
        .then(() => {
            if (settings.preConfigStartDelay) {
                return startLater(settings)
            }
            return start(settings)
        })
}

function startLater(settings: ClientSettings): Promise<SessionResult> {
    return new Promise(resolve => {
        setTimeout(() => {
            start(settings)
                .then(result => resolve(result))
        }, settings.preConfigStartDelay)
    })
}

function start(settings: ClientSettings): Promise<SessionResult> {
    return Promise.all(
        settings.providers
            .filter(provider => provider.shouldRun())
            .map(provider => provider.fetchSessionConfig())
    ).then(sessionConfigs => {
        sessionConfigs.forEach((v, i) => {
            settings.providers[i].setSessionConfig(v)
            v.setExpandedTasks(settings.providers[i].expandTasks())
        })
        return settings.sequence(sessionConfigs)
    })
}
