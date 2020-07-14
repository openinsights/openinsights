/**
 * Provides a mechanism to invoke a list of promises one at a time.
 * This can used by a {@link PromiseSequenceFunc} instead of Promise.all
 * @param funcs An array of functions that take no arguments and return a
 * Promise of type T
 * @returns A single promise that resolves with an array of T
 */
export default function sequence<T>(funcs: (() => Promise<T>)[]): Promise<T[]> {
    return funcs.reduce((prom: Promise<T[]>, func: () => Promise<T>): Promise<
        T[]
    > => {
        return prom.then(
            (results: T[]): Promise<T[]> =>
                func()
                    .then((result: T): T[] => [...results, result])
                    .catch((): Promise<T[]> => Promise.resolve(results)),
        )
    }, Promise.resolve([]))
}
