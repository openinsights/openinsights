import loadWhenReady from './util/loadWhenDocumentReady'
import { ClientSettings } from './@types'

export function init(settings: ClientSettings): void {
    loadWhenReady(() => {
        if (settings.preConfigStartDelay) {
            setTimeout(startLater(settings), settings.preConfigStartDelay)
        } else {
            start(settings)
        }
    })
}

function startLater(settings: ClientSettings): () => void {
    return function () {
        start(settings)
    }
}

function start(settings: ClientSettings): Promise<any> {
    return new Promise<any>(resolve => {
        Promise.all(
            settings.providers
                .filter(provider => provider.shouldRun())
                .map(provider => provider.fetchSessionConfig())
        ).then(sessionConfigs => {
            // There is an inconsistency here with how we expect fetchSessionConfig to return
            // an object and expandTasks to update internal members
            sessionConfigs.forEach((v, i) => {
                v.tasks.push(...settings.providers[i].expandTasks())
                settings.providers[i].setSessionConfig(v)
            })
            return settings.sequence(sessionConfigs)
        }).then(data => {
            console.log('Finished!')
            console.log(data)
        })
    })
}
