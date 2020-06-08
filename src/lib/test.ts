import { Executable, Provider } from "../@types"

enum TestState {
    NotStarted,
    Error,
    Running,
    Finished,
}

export abstract class Test implements Executable {
    private _state: TestState = TestState.NotStarted
    protected beaconData: unknown
    constructor(protected provider: Provider, protected config: unknown) { }

    get state(): TestState {
        return this._state
    }

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<unknown> {
        this._state = TestState.Running
        const result = this.makeTestSteps()
            .then((data): unknown => {
                const result: any = this.provider.makeBeaconData(this.config, data)
                this.setBeaconData(result)
                return result
            })
            .then((data): void => this.provider.sendBeacon(this.config, this.encodeBeaconData(data)))
            .then((): unknown => {
                this._state = TestState.Finished
                return this.beaconData
            })
            .catch((e): Promise<unknown> => {
                this._state = TestState.Error
                return Promise.resolve<unknown>('Replace me!')
            })
        return result
    }

    setBeaconData(value: any) {
        this.beaconData = value
    }

    /**
     * Convert the beacon data into an encoded payload suitable for transmission
     * @param data
     */
    protected encodeBeaconData(data: unknown): string {
        return JSON.stringify(data)
    }

    /**
     * A subclass implements this method in order to define its specialized mechanics
     */
    abstract makeTestSteps(): Promise<unknown[]>

    abstract makeBeaconURL(): string
}
