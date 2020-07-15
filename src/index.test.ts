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
import { Provider, SessionResult, SimpleObject } from "./@types"
import init from "./index"
import Fetch from "./lib/fetch"
import { TestCaseConfig, UnitTestProvider } from "./testUtil"
import ClientSettingsBuilder from "./util/clientSettingsBuilder"
import * as loadWhenDocumentReady from "./util/loadWhenDocumentReady"

type ProviderSetupFunc = () => Provider
type ValidateSessionResultFunc = (result: SessionResult) => void

describe("init", () => {
    type InitTestConfig = TestCaseConfig & {
        preConfigStartDelay?: number
        providerSetupFuncs: ProviderSetupFunc[]
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
            providerSetupFuncs: [
                () => createProviderStubs([[[{ value: "foo" }]]]),
                () => createProviderStubs([[[{ value: "bar" }]]]),
                () => createProviderStubs([[[{ value: "baz" }]]]),
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
            providerSetupFuncs: [
                () =>
                    createProviderStubs([
                        [
                            [{ value: "foo" }, { value: "bar" }],
                            [{ value: "baz" }],
                        ],
                    ]),
            ],
            validateSessionResultFunc: createSessionResultValidationFunc([
                [{ value: "foo" }, { value: "bar" }],
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
            testCase.providerSetupFuncs.forEach((f) => builder.addProvider(f()))
            // Code under test
            return init(builder.toSettings()).then((result) =>
                testCase.validateSessionResultFunc(result),
            )
        })
    })

    function createSessionResultValidationFunc(
        expectedResultData: SimpleObject[][],
    ): ValidateSessionResultFunc {
        return (result) => {
            expect(result.testResults.map((result) => result.data)).toEqual(
                expectedResultData,
            )
        }
    }

    function createProviderStubs(testData: SimpleObject[][][]) {
        const provider = new UnitTestProvider("Foo")
        sinon.stub(provider, "shouldRun").returns(Promise.resolve(true))
        testData.forEach((providerTestData) => {
            sinon
                .stub(provider, "fetchSessionConfig")
                .returns(Promise.resolve({ executables: [] }))
            sinon.stub(provider, "expandTasks").returns(
                providerTestData.map((testData) => {
                    const task = sinon.createStubInstance(Fetch)
                    task.execute.resolves({
                        testType: "some test type",
                        setupResult: {},
                        data: testData,
                    })
                    return task
                }),
            )
        })
        return provider
    }
})
