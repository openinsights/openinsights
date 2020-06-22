import { ClientSettings, Provider, PromiseSequenceFunc } from "../@types"
import defaultSequenceFunc from "./defaultSequenceFunc"

/**
 * TODO
 */
export default class ClientSettingsBuilder {
    /**
     * TODO
     */
    public value: ClientSettings = {
        preConfigStartDelay: 0,
        providers: [],
        sequence: defaultSequenceFunc,
    }

    /**
     * TODO
     * @param a TODO
     */
    setPreConfigStartDelay(a: number): void {
        this.value.preConfigStartDelay = a
    }

    /**
     * TODO
     * @param a TODO
     */
    addProvider(a: Provider): void {
        this.value.providers.push(a)
    }

    /**
     * TODO
     * @param a TODO
     */
    setSequence(a: PromiseSequenceFunc): void {
        this.value.sequence = a
    }
}
