/**
 * Tests for the ProviderBase class.
 */

import sinon from "sinon"
import { BeaconData, BeaconState, TestResultBundle } from "../@types"
import {
    UnitTestProvider,
    UnitTestSessionConfig,
    UnitTestTestConfig,
} from "../testUtil"

describe("ProviderBase", () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    afterEach(() => {
        sinon.restore()
    })

    test("name", () => {
        const expectedName = "Foo"
        const provider = new UnitTestProvider(expectedName)
        // Code under test
        expect(provider.name).toEqual(expectedName)
    })

    test(
        "encodeBeaconData",
        makeProviderTest({
            testFun: (provider) => {
                const testConfig: UnitTestTestConfig = {
                    type: "some type",
                }
                const data: BeaconData = {
                    state: BeaconState.Success,
                    testConfig: {
                        type: "some type",
                    },
                }
                // Code under test
                expect(provider.encodeBeaconData(testConfig, data)).toEqual(
                    JSON.stringify({
                        state: BeaconState.Success,
                        testConfig: {
                            type: "some type",
                        },
                    }),
                )
            },
        }),
    )

    test(
        "sendBeaconData",
        makeProviderTest({
            testFun: (provider) => {
                sinon.stub(provider, "makeBeaconURL").returns("some URL")
                const testConfig: UnitTestTestConfig = {
                    type: "some type",
                }
                // Code under test
                provider.sendBeacon(testConfig, "some data")
                // Verify
                expect(fetchMock.mock.calls).toEqual([
                    [
                        "some URL",
                        {
                            method: "POST",
                            body: "some data",
                            keepalive: true,
                        },
                    ],
                ])
            },
        }),
    )

    test(
        "setSessionConfig",
        makeProviderTest({
            providerName: "Foo",
            testFun: (provider) => {
                type FooConfig = UnitTestSessionConfig & {
                    foo: string
                }
                const container: FooConfig = {
                    foo: "bar",
                }
                provider.setSessionConfig(container)
                expect((provider.sessionConfig as FooConfig).foo).toEqual("bar")
            },
        }),
    )

    test(
        "makeBeaconURL",
        makeProviderTest({
            testFun: (provider) => {
                const testConfig = {
                    type: "some type",
                }
                expect(() => {
                    provider.makeBeaconURL(testConfig)
                }).toThrow("Method not implemented.")
            },
        }),
    )

    test(
        "testSetUp",
        makeProviderTest({
            testFun: (provider) => {
                const testConfig = {
                    type: "some type",
                }
                return expect(provider.testSetUp(testConfig)).resolves.toEqual(
                    {},
                )
            },
        }),
    )

    test(
        "testTearDown",
        makeProviderTest({
            testFun: (provider) => {
                const resultBundle: TestResultBundle = {
                    testType: "foo",
                    data: [],
                    setupResult: {},
                }
                return expect(
                    provider.testTearDown(resultBundle),
                ).resolves.toBe(resultBundle)
            },
        }),
    )

    type MakeProviderOpts = {
        providerName?: string
        testFun: (provider: UnitTestProvider) => void
    }

    function makeProviderTest(args: MakeProviderOpts): jest.ProvidesCallback {
        return () => {
            const provider = new UnitTestProvider(
                args.providerName || "Some Provider",
            )
            return args.testFun(provider)
        }
    }
})
