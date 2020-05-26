import { TaskInterface, ProviderInterface } from "../@types";
import { beacon } from "../util/beacon"

interface State {
    hasRan: boolean
}

export abstract class TestBase implements TaskInterface {
    public state: State = { hasRan: false };
    constructor(protected provider: ProviderInterface) {
        if (!this.provider.sessionConfig) {
            throw new Error('TestBase ctor called before Provider.setSessionConfig')
        }
    }

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<unknown> {
        console.warn('Test.execute...WIP')
        console.log(`Inside Test.execute for ${this.provider.name} test id: ${this.provider.getCurrentTestId()}`)
        const steps = this.makeTestSteps()
        const result = steps
            .then((data): unknown => this.makeBeaconData(...data))
            .then((data): string => this.encodeBeaconData(data))
            .then((data): void => this.sendBeacon(data))
            .then((): unknown => this.returnBeacon())
            .catch((e): Promise<unknown> => {
                console.log(`Error caught in TestBase.execute: ${e}`)
                console.log(result)
                return Promise.resolve<unknown>('Replace me!')
            })
        return result
    }

    sendBeacon(data: string): void {
        beacon(this.makeBeaconURL(), data)
    }

    /**
     * Convert the beacon data into an encoded payload suitable for transmission
     * @param data
     */
    protected encodeBeaconData(data: unknown): string {
        return JSON.stringify(data)
    }

    /**
     * A subclass implements this method in order to define its beacon format
     */
    abstract makeBeaconData(...data: unknown[]): unknown

    /**
     * A subclass implements this method in order to define its specialized mechanics
     */
    abstract makeTestSteps(): Promise<unknown[]>

    abstract makeBeaconURL(): string

    abstract returnBeacon(): unknown
}
