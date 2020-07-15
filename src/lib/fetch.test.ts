/**
 * Unit tests covering the Fetch class.
 * @packageDocumentation
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as sinon from "sinon"
import {
    HttpHeader,
    ResourceTimingEntry,
    SimpleObject,
    TestConfiguration,
    TestResultBundle,
    TestSetupResult,
} from "../@types"
import {
    makePerformanceTimingEntry,
    TestCaseConfig,
    UnitTestProvider,
} from "../testUtil"
import * as Beacon from "./beacon"
import Fetch, { FetchConfiguration } from "./fetch"
import * as resourceTiming from "./resourceTiming"
import { TestState } from "./test"

type SendBeaconArgs = [FetchConfiguration, string]

type AsyncGetEntryResult = {
    entry: ResourceTimingEntry
}

function isAsyncGetEntryResult(value: any): value is AsyncGetEntryResult {
    return (value as AsyncGetEntryResult).entry !== undefined
}

type AsyncGetEntryError = {
    error: Error
}

function isAsyncGetEntryError(value: any): value is AsyncGetEntryError {
    return (value as AsyncGetEntryError).error !== undefined
}

type FetchExecuteTestConfig = TestCaseConfig & {
    createFetchTestResultResult: TestResultBundle
    encodeBeaconDataResult?: string
    expectedRequestHeaders: HttpHeader[]
    executeResult: TestResultBundle
    fetchConfig: TestConfiguration
    finalState: TestState
    asyncGetEntryResult: AsyncGetEntryResult | AsyncGetEntryError
    getResourceRequestHeadersResult: HttpHeader[]
    makeBeaconDataResult?: Beacon.Data
    resourceUrl: string
    sendBeaconArgs?: SendBeaconArgs[]
    testSetUpResult: TestSetupResult
    testTearDownResult?: TestResultBundle
}

describe("Fetch.execute", () => {
    const testCases: FetchExecuteTestConfig[] = [
        makeBaseTestConfig(
            "Send beacon on successful test, including test setup metadata",
        ),
        ((): FetchExecuteTestConfig => {
            const result = makeBaseTestConfig(
                "Returns expected response headers",
            )
            result.getResourceRequestHeadersResult = [
                ["foo", "some value"],
                ["foo", "some other value"],
            ]
            result.expectedRequestHeaders = [
                ["foo", "some value,some other value"],
            ]
            return result
        })(),
        ((): FetchExecuteTestConfig => {
            const result = makeBaseTestConfig(
                "When asyncGetEntry fails to find resource," +
                    " throw the expected error",
            )
            result.asyncGetEntryResult = { error: new Error("Oh noes!") }
            delete result.sendBeaconArgs
            result.executeResult = {
                testType: "some type",
                setupResult: {
                    data: {},
                },
                data: [],
            }
            result.finalState = TestState.Error
            return result
        })(),
    ]
    let asyncGetEntry: sinon.SinonStub<any[], Promise<SimpleObject>>
    beforeEach(() => {
        fetchMock.resetMocks()
        asyncGetEntry = sinon.stub(resourceTiming, "asyncGetEntry")
    })
    afterEach(() => {
        sinon.restore()
    })
    testCases.forEach((testCase) => {
        test(testCase.description, () => {
            // Setup stubs
            const provider = sinon.createStubInstance(UnitTestProvider)
            provider.testSetUp.returns(
                Promise.resolve(testCase.testSetUpResult),
            )
            provider.getResourceUrl.returns(new URL(testCase.resourceUrl))
            const fetch = new Fetch(provider, testCase.fetchConfig)

            // Prepare the expected provider hook implementations
            provider.getResourceRequestHeaders.returns(
                testCase.getResourceRequestHeadersResult,
            )
            provider.createFetchTestResult.returns(
                Promise.resolve(testCase.createFetchTestResultResult),
            )
            if (testCase.makeBeaconDataResult) {
                provider.makeBeaconData.returns(testCase.makeBeaconDataResult)
            }
            if (testCase.encodeBeaconDataResult) {
                provider.encodeBeaconData.returns(
                    testCase.encodeBeaconDataResult,
                )
            }
            if (!testCase.testTearDownResult) {
                provider.testTearDown.returnsArg(0)
            }

            // Prepare the expected asyncGetEntry result
            if (isAsyncGetEntryResult(testCase.asyncGetEntryResult)) {
                asyncGetEntry.resolves(testCase.asyncGetEntryResult.entry)
            } else if (isAsyncGetEntryError(testCase.asyncGetEntryResult)) {
                asyncGetEntry.rejects(testCase.asyncGetEntryResult.error)
            }

            return fetch.execute().then((result) => {
                // Verify behaviors:
                // Final test state
                expect(fetch.state).toBe(testCase.finalState)

                // Promise resolution
                expect(result).toEqual(testCase.executeResult)

                // If and how the client called the provider sendBeacon hook
                if (testCase.sendBeaconArgs) {
                    expect(provider.sendBeacon.args).toEqual(
                        testCase.sendBeaconArgs,
                    )
                } else {
                    expect(provider.sendBeacon.called).toBeFalsy()
                }

                // How the client made the fetch request
                expect(fetchMock.mock.calls.length).toEqual(1)
                const request = fetchMock.mock.calls[0][0] as Request
                expect(request.url).toEqual(testCase.resourceUrl)
                testCase.expectedRequestHeaders.forEach((header) => {
                    expect(request.headers.get(header[0])).toEqual(header[1])
                })
            })
        })
    })

    function makeBaseTestConfig(description: string): FetchExecuteTestConfig {
        const result: FetchExecuteTestConfig = {
            description,
            createFetchTestResultResult: {
                testType: "some type",
                setupResult: {},
                data: [{ foo: "foo" }, { bar: "bar" }],
            },
            fetchConfig: {
                type: "some type",
            },
            encodeBeaconDataResult: JSON.stringify({ foo: "bar" }),
            executeResult: {
                testType: "some type",
                setupResult: {},
                data: [{ foo: "foo" }, { bar: "bar" }],
                beaconData: {
                    state: Beacon.State.Success,
                    testConfig: {
                        type: "foo",
                    },
                    data: {
                        a: 123,
                        b: "abc",
                        d: true,
                    },
                },
            },
            expectedRequestHeaders: [],
            asyncGetEntryResult: {
                entry: Object.assign<SimpleObject, PerformanceResourceTiming>(
                    {},
                    makePerformanceTimingEntry("http://foo.com/test.png"),
                ),
            },
            // No request headers by default
            getResourceRequestHeadersResult: [],
            testSetUpResult: {},
            resourceUrl: "http://foo.com/test.png",
            finalState: TestState.Finished,
            makeBeaconDataResult: {
                state: Beacon.State.Success,
                testConfig: {
                    type: "foo",
                },
                data: {
                    a: 123,
                    b: "abc",
                    d: true,
                },
            },
            sendBeaconArgs: [
                [
                    {
                        type: "some type",
                        performanceTimingObserverTimeout: 5000,
                    },
                    JSON.stringify({ foo: "bar" }),
                ],
            ],
        }
        return result
    }
})

type FetchTestError = { error: string }

function isFetchTestError(value: any): value is FetchTestError {
    return (value as FetchTestError).error !== undefined
}

type FetchTestResult = TestResultBundle | FetchTestError

/**
 * This suite has a more limited scope than the one covering Fetch.execute,
 * but it does not stub-out asyncGetEntry, so it's possible to test the
 * default resource timing entry validation predicate.
 */
describe("Fetch.test", () => {
    const testCases: (TestCaseConfig & {
        testSetUpResult: TestSetupResult
        resourceUrl: string
        fetchConfig: FetchConfiguration
        getEntriesResults: PerformanceEntryList
        fetchTestResult: FetchTestResult
    })[] = [
        {
            description: "valid resource",
            testSetUpResult: {},
            resourceUrl: "https://example.com/test.png",
            fetchConfig: {
                type: "some type",
            },
            getEntriesResults: [
                makePerformanceTimingEntry("https://example.com/test.png"),
            ],
            fetchTestResult: {
                testType: "some type",
                setupResult: {},
                data: [],
            },
        },
        {
            description: "requestStart 0 is invalid",
            testSetUpResult: {},
            resourceUrl: "https://example.com/test.png",
            fetchConfig: {
                type: "some type",
                performanceTimingObserverTimeout: 500,
            },
            getEntriesResults: [
                makePerformanceTimingEntry("https://example.com/test.png", {
                    requestStart: 0,
                }),
            ],
            fetchTestResult: {
                error:
                    "Timed out observing resource timing" +
                    " (https://example.com/test.png)",
            },
        },
    ]
    let getEntries: sinon.SinonStub<any[], PerformanceEntryList>
    beforeEach(() => {
        getEntries = window.performance.getEntries = sinon.stub()
    })
    afterEach(() => {
        delete window.performance.getEntries
    })
    testCases.forEach((testCase) => {
        test(testCase.description, () => {
            // Setup stubs
            const provider = sinon.createStubInstance(UnitTestProvider)
            provider.getResourceRequestHeaders.returns([])
            provider.getResourceUrl.returns(new URL(testCase.resourceUrl))
            if (!isFetchTestError(testCase.fetchTestResult)) {
                provider.createFetchTestResult.resolves(
                    testCase.fetchTestResult,
                )
            }
            const fetch = new Fetch(provider, testCase.fetchConfig)

            // Mock the fetchObject call
            const response = sinon.createStubInstance(Response)
            sinon.stub(fetch, "fetchObject").resolves(response)

            // Setup expected calls to window.performance.getEntries
            getEntries.returns(testCase.getEntriesResults)

            // Code under test
            if (isFetchTestError(testCase.fetchTestResult)) {
                expect.assertions(1)
                return fetch.test(testCase.testSetUpResult).catch((e) => {
                    if (isFetchTestError(testCase.fetchTestResult)) {
                        expect(e.message).toEqual(
                            testCase.fetchTestResult.error,
                        )
                    }
                })
            }
            return fetch.test(testCase.testSetUpResult).then((result) => {
                if (testCase.fetchTestResult) {
                    expect(result).toEqual(testCase.fetchTestResult)
                }
            })
        })
    })
})
