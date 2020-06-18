import { ClientSettings, Provider, PromiseSequenceFunc } from "../@types"
import defaultSequenceFunc from "./defaultSequenceFunc"

export default class ClientSettingsBuilder {
    public value: ClientSettings = {
        preConfigStartDelay: 0,
        providers: [],
        sequence: defaultSequenceFunc,
    }
    setPreConfigStartDelay(a: number): void {
        this.value.preConfigStartDelay = a
    }
    addProvider(a: Provider): void {
        this.value.providers.push(a)
    }
    setSequence(a: PromiseSequenceFunc): void {
        this.value.sequence = a
    }
}
