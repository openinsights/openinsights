import { ClientSettings, SessionResult, Executable } from "./@types"
import defaultSessionProcessFunc from "./util/defaultSessionProcessFunc"
import whenReady from "./util/loadWhenDocumentReady"

/**
 * Called by tag owner code to initialize a RUM session, either immediately or
 * after some delay.
 *
 * @remarks
 * Waits for the page to load before processing.
 *
 * @param settings Specifies settings affecting client behavior. These are
 * determined by the tag owner at runtime, so may be used to specify page-level
 * overrides to general defaults.
 */
export default function init(settings: ClientSettings): Promise<SessionResult> {
    return whenReady().then(() => {
        if (settings.preConfigStartDelay) {
            return startLater(settings.preConfigStartDelay, settings)
        }
        return start(settings)
    })
}

/**
 * Called internally if a non-zero {@link ClientSettings.preConfigStartDelay}
 * setting has been specified. Calls {@link start} after the delay.
 *
 * @param delay The approximate time to wait (in milliseconds).
 * @param settings The settings object passed to {@link init}.
 */
function startLater(
    delay: number,
    settings: ClientSettings,
): Promise<SessionResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            start(settings).then((result) => resolve(result))
        }, delay)
    })
}

/**
 * Called immediately by {@link init} if no
 * {@link ClientSettings.preConfigStartDelay} setting has been specified.
 *
 * @param settings The settings object passed to {@link init}.
 */
function start(settings: ClientSettings): Promise<SessionResult> {
    const activeProviders = settings.providers.filter((p) => p.shouldRun())
    // We can't use Promise.allSettled() below due to browser support.
    // Therefore, we implement it manually via p.then().catch() to collect all
    // results regardless of their resolution status. I.e. we polyfill.
    return Promise.all(
        activeProviders.map((provider) => provider.fetchSessionConfig())
        .map((p) =>
            p.then((value) => ({
                status: "fulfilled",
                value
            }))
            .catch((reason) => ({
                status: 'rejected',
                reason
            }))
        )
    ).then((settled) => {
        const executables: Executable[] = []
        settled.forEach((result, idx) => {
            if (result.status === "fulfilled" && "value" in result) {
                const provider = activeProviders[idx]
                provider.setSessionConfig(result.value)
                executables.push(...provider.expandTasks())
            }
        })
        const process = settings.sessionProcess || defaultSessionProcessFunc
        return process(executables)
    })
}
