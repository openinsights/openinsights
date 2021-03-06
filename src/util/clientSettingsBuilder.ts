import { ClientSettings, Provider, SessionProcessFunc } from "../@types"

/**
 * A utility class used to generate a {@link ClientSettings} object suitable
 * to pass to {@link init}.
 */
export default class ClientSettingsBuilder {
    /**
     * Private member used to capture settings as they are added by the tag
     * owner.
     */
    private _value: ClientSettings = {
        preConfigStartDelay: 0,
        providers: [],
    }

    /**
     * Returns a {@link ClientSettings} object as specified by the site owner
     * at the point when it is called.
     */
    toSettings(): ClientSettings {
        return this._value
    }

    /**
     * Set the {@link ClientSettings.preConfigStartDelay}.
     * @param value See {@link ClientSettings.preConfigStartDelay}.
     */
    setPreConfigStartDelay(value: number): void {
        this._value.preConfigStartDelay = value
    }

    /**
     * Add a provider to the {@link ClientSettings.providers} array.
     * @param provider The {@link Provider} to add. For mor information,
     * see {@link ClientSettings.providers}.
     */
    addProvider(provider: Provider): void {
        this._value.providers.push(provider)
    }

    /**
     * Set the {@link ClientSettings.sessionProcess} setting.
     * @param value See {@link ClientSettings.sessionProcess}.
     */
    setSessionProcessFunc(value: SessionProcessFunc): void {
        this._value.sessionProcess = value
    }
}
