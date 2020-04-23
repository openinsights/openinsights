import { PageSettings } from "../types/pageSettings"
import { Provider } from "../types/provider"

export class PageSettingsBuilder {
    private data: PageSettings = {
        providers: []
    }
    toPageSettings(): PageSettings {
        return this.data
    }
    setPreConfigStartDelay(value: number): void {
        this.data.preConfigStartDelay = value
    }
    addProvider(p: Provider): void {
        this.data.providers.push(p)
    }
}
