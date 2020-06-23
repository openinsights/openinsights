/**
 * Top-level index.ts for the Open Insights library.
 * @packageDocumentation
 */
import whenReady from "./util/loadWhenDocumentReady"
import { ClientSettings, SessionResult } from "./@types"

/**
 * TODO
 * @param settings TODO
 */
export default function init(settings: ClientSettings): Promise<SessionResult> {
    return whenReady().then(() => {
        if (settings.preConfigStartDelay) {
            return startLater(settings)
        }
        return start(settings)
    })
}

/**
 * TODO
 * @param settings TODO
 */
function startLater(settings: ClientSettings): Promise<SessionResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            start(settings).then((result) => resolve(result))
        }, settings.preConfigStartDelay)
    })
}

/**
 * TODO
 * @param settings TODO
 */
function start(settings: ClientSettings): Promise<SessionResult> {
    return Promise.all(
        settings.providers
            .filter((provider) => provider.shouldRun())
            .map((provider) => provider.fetchSessionConfig()),
    ).then((sessionConfigs) => {
        sessionConfigs.forEach((v, i) => {
            settings.providers[i].setSessionConfig(v)
            v.setExpandedTasks(settings.providers[i].expandTasks())
        })
        return settings.sequence(sessionConfigs)
    })
}
