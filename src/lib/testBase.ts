import { Executable, Provider } from "../@types"

interface State {
    hasRan: boolean
}

export abstract class TestBase implements Executable {
    public state: State = { hasRan: false }
    protected beaconData: unknown
    constructor(protected provider: Provider, protected config: unknown) {}

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<unknown> {
        const result = this.makeTestSteps()
            .then((data): unknown => {
                const result: any = this.provider.makeBeaconData(this.config, data)
                this.setBeaconData(result)
                return result
            })
            .then((data): void => this.provider.sendBeacon(this.config, this.encodeBeaconData(data)))
            .then((): unknown => this.beaconData)
            .catch((e): Promise<unknown> => {
                console.log(`Error caught in TestBase.execute: ${e}`)
                console.log(result)
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
