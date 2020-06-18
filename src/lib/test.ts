import { Executable, Provider, ResultBundle, TestConfiguration, TestSetupResult } from "../@types";
import * as Beacon from "./beacon";

enum TestState {
    NotStarted,
    Error,
    Running,
    Finished,
}

export abstract class Test implements Executable {
    private _state: TestState = TestState.NotStarted;
    constructor(protected provider: Provider, protected config: TestConfiguration) {}

    get state(): TestState {
        return this._state;
    }

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<ResultBundle> {
        this._state = TestState.Running;
        return this.provider
            .testSetUp(this.config)
            .then((setupResult) => this.test(setupResult))
            .then((bundle) => {
                // Add beacon data to the result bundle
                bundle.beaconData = this.provider.makeBeaconData(this.config, bundle);
                this.provider.sendBeacon(this.config, this.provider.encodeBeaconData(this.config, bundle.beaconData));
                this._state = TestState.Finished;
                return bundle;
            })
            .then((bundle) => this.provider.testTearDown(bundle))
            .catch(
                (e): Promise<ResultBundle> => {
                    this._state = TestState.Error;
                    // TODO: notify subscribers of error
                    return Promise.resolve({
                        testType: this.config.type,
                        data: [],
                        setupResult: {
                            data: {}
                        }
                    });
                }
            );
    }

    /**
     * A subclass implements this method in order to define its specialized mechanics
     */
    abstract test(setupResult: TestSetupResult): Promise<ResultBundle>;

    abstract makeBeaconURL(): string;
}
