/**
 * Primarily tests the init function from ./index.ts.
 *
 * Also covers:
 * * util/clientSettingsBuilder.ts
 * * util/defaultPromiseSequence.ts
 * * util/promiseSequence.ts
 * @packageDocumentation
 */
import sinon from "sinon"
import { Provider, SessionResult, TestResult } from "./@types"
import init from "./init"
import Fetch from "./lib/fetch"
import { TestCaseConfig, UnitTestProvider } from "./testUtil"
import ClientSettingsBuilder from "./util/clientSettingsBuilder"
import * as loadWhenDocumentReady from "./util/loadWhenDocumentReady"

type PromiseResult = "fulfilled" | "rejected"

/**
 * Represents the list of {@link TestResult} objects associated with a single
 * {@link Test}.
 */
type TaskResultData = TestResult[]

/**
 * Represents a population of expected data objects returned in the
 * Array<TestResultBundle> for one session. In any test case, there may be more
 * than one of these depending on the number of expected calls to
 * {@link fetchSessionConfig}.
 */
type SessionTestData = TaskResultData[]

interface ProviderStubConfig {
    providerName: string
    shouldRunResult: boolean
    /**
     * Represents the result of zero or more calls to
     * {@link Provider.fetchSessionConfig}.
     *
     * @remarks
     *
     * These are not the actual results of the call, but simply an array of
     * {@link PromiseResult} specifying whether the Promise resolves or
     * rejects. The unit being tested doesn't really use the result, so we
     * don't probe that here.
     */
    fetchConfigResults: PromiseResult[]
    /**
     * The expected "data" objects included in the {@link SessionResult}
     * objects resulting from the unit test, partitioned by session
     * and {@link Test}.
     */
    expectedTestData: SessionTestData[]
}
type ValidateSessionResultFunc = (result: SessionResult) => void

describe("init", () => {
    type InitTestConfig = TestCaseConfig & {
        preConfigStartDelay?: number
        providers: Provider[]
        validateSessionResultFunc: ValidateSessionResultFunc
    }
    const testCases: InitTestConfig[] = [
        {
            description: [
                "Waits for document to load",
                // Determined by code coverage
                "non-zero pre-config start delay causes delay",
            ].join("; "),
            preConfigStartDelay: 1,
            providers: [
                makeUnitTestProvider({
                    providerName: "Foo",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [
                        [
                            [
                                {
                                    value: "foo",
                                },
                            ],
                        ],
                    ],
                }),
                makeUnitTestProvider({
                    providerName: "Bar",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [
                        [
                            [
                                {
                                    value: "bar",
                                },
                            ],
                        ],
                    ],
                }),
                makeUnitTestProvider({
                    providerName: "Baz",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [
                        [
                            [
                                {
                                    value: "baz",
                                },
                            ],
                        ],
                    ],
                }),
            ],
            validateSessionResultFunc: createSessionResultValidationFunc([
                [{ value: "foo" }],
                [{ value: "bar" }],
                [{ value: "baz" }],
            ]),
        },
        {
            description: [
                "Waits for document to load",
                // Determined by code coverage
                "zero pre-config start delay causes no delay",
            ].join("; "),
            preConfigStartDelay: 0,
            providers: [
                makeUnitTestProvider({
                    providerName: "Foo",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [
                        [
                            [{ value: "foo" }, { value: "bar" }],
                            [{ value: "baz" }],
                        ],
                    ],
                }),
            ],
            validateSessionResultFunc: createSessionResultValidationFunc([
                [{ value: "foo" }, { value: "bar" }],
                [{ value: "baz" }],
            ]),
        },
        {
            description: "One provider skipped",
            preConfigStartDelay: 0,
            providers: [
                makeUnitTestProvider({
                    providerName: "Foo",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [[[{ value: "foo" }]]],
                }),
                makeUnitTestProvider({
                    providerName: "Bar",
                    shouldRunResult: false,
                    fetchConfigResults: [],
                    expectedTestData: [],
                }),
                makeUnitTestProvider({
                    providerName: "Baz",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [[[{ value: "baz" }]]],
                }),
            ],
            validateSessionResultFunc: createSessionResultValidationFunc([
                [{ value: "foo" }],
                [{ value: "baz" }],
            ]),
        },
        {
            description: "One provider session config request failed",
            preConfigStartDelay: 0,
            providers: [
                makeUnitTestProvider({
                    providerName: "Foo",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [[[{ value: "foo" }]]],
                }),
                makeUnitTestProvider({
                    providerName: "Bar",
                    shouldRunResult: true,
                    fetchConfigResults: ["rejected"],
                    expectedTestData: [],
                }),
                makeUnitTestProvider({
                    providerName: "Baz",
                    shouldRunResult: true,
                    fetchConfigResults: ["fulfilled"],
                    expectedTestData: [[[{ value: "baz" }]]],
                }),
            ],
            validateSessionResultFunc: createSessionResultValidationFunc([
                [{ value: "foo" }],
                [{ value: "baz" }],
            ]),
        },
    ]
    let sandbox: sinon.SinonSandbox
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    let whenReady: sinon.SinonStub<any[], Promise<void>>
    /* eslint-enable @typescript-eslint/no-explicit-any*/
    beforeEach(() => {
        sandbox = sinon.createSandbox()
        whenReady = sandbox.stub(loadWhenDocumentReady, "default")
    })
    afterEach(() => {
        sandbox.restore()
    })
    testCases.forEach((testCase) => {
        test(testCase.description, () => {
            whenReady.resolves()
            const builder = new ClientSettingsBuilder()
            if (typeof testCase.preConfigStartDelay === "number") {
                builder.setPreConfigStartDelay(testCase.preConfigStartDelay)
            }
            // Setup each provider and add them to the builder
            testCase.providers.forEach((p) => builder.addProvider(p))
            // Code under test
            return init(builder.toSettings()).then((result) =>
                testCase.validateSessionResultFunc(result),
            )
        })
    })

    function createSessionResultValidationFunc(
        expectedResultData: TaskResultData[],
    ): ValidateSessionResultFunc {
        return (result) => {
            expect(result.testResults.map((result) => result.data)).toEqual(
                expectedResultData,
            )
        }
    }

    function makeUnitTestProvider(stubConfig: ProviderStubConfig) {
        const provider = new UnitTestProvider(stubConfig.providerName)
        // Assuming shouldRun will resolve the same each time it's called.
        sinon.stub(provider, "shouldRun").returns(stubConfig.shouldRunResult)
        const fetchSessionConfig = sinon.stub(provider, "fetchSessionConfig")
        if (stubConfig.fetchConfigResults.length) {
            let call = 0
            stubConfig.fetchConfigResults.forEach((result) => {
                if (result == "fulfilled") {
                    fetchSessionConfig
                        .onCall(call++)
                        .resolves({ executables: [] })
                } else {
                    fetchSessionConfig
                        .onCall(call++)
                        .rejects(new Error("Some error"))
                }
            })
        }
        const expandTasks = sinon.stub(provider, "expandTasks")
        if (stubConfig.expectedTestData.length) {
            let call = 0
            stubConfig.expectedTestData.forEach((sessionTestData) => {
                expandTasks.onCall(call++).returns(
                    sessionTestData.map((taskResultData) => {
                        const task = sinon.createStubInstance(Fetch)
                        task.execute.resolves({
                            testType: "some test type",
                            setupResult: {},
                            data: taskResultData,
                        })
                        return task
                    }),
                )
            })
        }
        return provider
    }
})
