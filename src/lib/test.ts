import {
    Executable,
    Provider,
    TestResultBundle,
    TestConfiguration,
    TestSetupResult,
} from "../@types"

/**
 * The possible states that a {@link Test} can be in.
 */
export enum TestState {
    /**
     * The test is not yet started.
     */
    NotStarted,
    /**
     * The test started, but reached an error condition. Once in this state,
     * a test should not be able to move to another state.
     */
    Error,
    /**
     * The test started, but has not finished or reached an error condition.
     */
    Running,
    /**
     * The test finished without reaching an error condition. Once reached, a
     * test should not be able to move to another state.
     */
    Finished,
}

/**
 * An abstract class representing a RUM test. Subclasses must implement
 * abstract methods in order to define a particular type of RUM test.
 */
export abstract class Test implements Executable {
    /**
     * The current test state.
     */
    private _state: TestState = TestState.NotStarted

    /**
     * @param _provider The provider that owns the test
     * @param _config The provider-defined configuration for the test
     */
    constructor(
        /**
         * The provider that owns the test. Through this member variable,
         * the client is able to reach a number of provider "hooks",
         * enabling providers to define and customize behavior.
         */
        protected _provider: Provider,
        /**
         * The provider-defined configuration for the test.
         */
        protected _config: TestConfiguration,
    ) {}

    /**
     * Indicates the current state of the test.
     */
    get state(): TestState {
        return this._state
    }

    /**
     * This is the logic function for conducting an individual test.
     */
    execute(): Promise<TestResultBundle> {
        this._state = TestState.Running
        return this._provider
            .testSetUp(this._config)
            .then((setupResult) => this.test(setupResult))
            .then((bundle) => {
                // Set the provider name
                bundle.providerName = this._provider.name
                // Add beacon data to the result bundle
                bundle.beaconData = this._provider.makeBeaconData(
                    this._config,
                    bundle,
                )
                this._provider
                    .sendBeacon(
                        this._config,
                        this._provider.encodeBeaconData(
                            this._config,
                            bundle.beaconData,
                        ),
                    )
                    .then(
                        (result) => {
                            this._provider.onSendBeaconResolved(result)
                        },
                        (error) => {
                            this._provider.onSendBeaconRejected(error)
                        },
                    )
                this._state = TestState.Finished
                return bundle
            })
            .then((bundle) => this._provider.testTearDown(bundle))
            .catch(
                (): Promise<TestResultBundle> => {
                    this._state = TestState.Error
                    // TODO: Notify subscribers of error
                    // TODO: If we're going to resolve here (and maybe we
                    // should reject instead), then perhaps we should
                    // add some information about the error to the
                    // TestResultBundle.
                    return Promise.resolve({
                        providerName: this._provider.name,
                        testType: this._config.type,
                        data: [],
                        setupResult: {
                            data: {},
                        },
                    })
                },
            )
    }

    /**
     * A subclass implements this method in order to define its specialized
     * mechanics.
     * @param setupResult Result of the previous {@link Provider.testSetUp} call
     * @returns A Promise resolving to a {@link ResultBundle} object, the
     * result of calling {@link Provider.createFetchTestResult} when the test
     * data has been obtained.
     */
    abstract test(setupResult: TestSetupResult): Promise<TestResultBundle>
}
