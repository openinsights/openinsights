/**
 * The set of known errors that may occur.
 */
export enum KnownErrors {
    /**
     * An error occurred when attempting to send beacon data.
     */
    SendBeacon,
    /**
     * An error occurred when the provider attempted to fetch its session configuration.
     */
    ProviderConfigFetch,
    /**
     * An error occurred when the provider attempted to fetch a test resource.
     */
    TestResourceFetch,
    /**
     * An error occurred during test execution.
     */
    TestExecution,
}
