import { Executable, Provider, ResultBundle, TestConfiguration } from "../@types"
import * as Beacon from './beacon'

enum TestState {
    NotStarted,
    Error,
    Running,
    Finished,
}

export abstract class Test implements Executable {

    private _state: TestState = TestState.NotStarted
    private _beaconData?: Beacon.Data
    constructor(protected provider: Provider, protected config: TestConfiguration) { }

    get state(): TestState {
        return this._state
    }

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<Beacon.Data> {
        this._state = TestState.Running
        return this.test()
            .then((bundle): Beacon.Data => {
                return this._beaconData = this.provider.makeBeaconData(this.config, bundle)
            })
            .then((data): void => this.provider.sendBeacon(this.config, this.provider.encodeBeaconData(this.config, data)))
            .then((): Beacon.Data => {
                this._state = TestState.Finished
                if (this._beaconData) {
                    return this._beaconData
                }
                throw new Error('Beacon data not set.')
            })
            .catch((e): Promise<Beacon.Data> => {
                this._state = TestState.Error
                // TODO: notify subscribers of error
                console.log(e)
                return Promise.resolve({
                    state: Beacon.State.Unknown,
                    testType: 'foo',
                })
            })
    }

    /**
     * A subclass implements this method in order to define its specialized mechanics
     */
    abstract test(): Promise<ResultBundle>

    abstract makeBeaconURL(): string
}
