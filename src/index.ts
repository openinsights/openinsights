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
    }).then(data => {
        console.log('Finished!')
        console.log(data)
    })
}
