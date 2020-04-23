import loadWhenReady from './util/loadWhenDocumentReady'
import { DefaultPageSettings } from './util/defaultPageSettings'
import { PageSettings } from './types/pageSettings'
import { Provider } from './types/provider'
export { PageSettingsBuilder } from './util/pageSettingsBuilder'

export function init(settings: PageSettings): void {
    loadWhenReady(() => {
        console.log('Document loaded and ready')
        settings = settings || DefaultPageSettings
        if (settings.preConfigStartDelay) {
            setTimeout(startLater(settings), settings.preConfigStartDelay)
        } else {
            start(settings)
        }
    })
}

function startLater(settings: PageSettings): () => void {
    return function () {
        start(settings)
    }
}

function start(settings: PageSettings): void {
    const promises = settings.providers
        .filter(p => p.testUserAgent())
        .map(p => p.fetchConfig())
    if (promises.length) {
        Promise.all(promises)
            .then(providerConfigs => {
                const temp = <[Provider, unknown, unknown[]][]>providerConfigs
                for (let config of temp) {
                    let provider: Provider = config[0]
                    for (let task of config[2]) {
                        provider.executeTask(config[1], task)
                    }
                }
            })
            .catch(error => {
                console.error(error)
            })
    } else {
        console.log('No providers promised to make config calls')
    }
}
