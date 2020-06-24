/* eslint-disable
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-module-boundary-types,
*/

/**
 * Creates a pipeline that can be used to execute a series of discrete
 * functions on an object of the given type R, returning the final result.
 * Functions are executed in the reverse order given.
 *
 * @param fn1 Last function in the pipeline
 * @param fns Pipeline functions, minus the last one.
 */
const compose = <R>(fn1: (a: R) => R, ...fns: ((a: R) => R)[]) =>
    fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1)

export default compose
