/* eslint-disable
    @typescript-eslint/explicit-function-return-type,
    @typescript-eslint/explicit-module-boundary-types,
*/

/**
 * TODO
 * @param fn1 TODO
 * @param fns TODO
 */
const compose = <R>(fn1: (a: R) => R, ...fns: ((a: R) => R)[]) =>
    fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1)

export default compose
