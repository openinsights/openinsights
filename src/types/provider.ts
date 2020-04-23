export interface Provider {
    executeTask(sessionConfig: unknown, task: unknown): void
    fetchConfig(): Promise<unknown>
    testUserAgent(): boolean
}
