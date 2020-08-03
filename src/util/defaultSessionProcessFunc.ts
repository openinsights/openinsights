import { Executable, SessionProcessFunc } from "../@types"
import sequence from "./promiseSequence"

/**
 * Default session processing function.
 *
 * @remarks
 * See {@link SessionProcessFunc}.
 *
 * @param sessionConfigs Array of {@link Executable} objects from which to
 * generate a Promise<{@link SessionResult}>
 */
const defaultSessionProcessFunc: SessionProcessFunc = (
    executables: Executable[],
) => {
    const makeTaskExecFunc = (task: Executable) => () => task.execute()
    return sequence(executables.map(makeTaskExecFunc)).then((testResults) => {
        return { testResults }
    })
}

export default defaultSessionProcessFunc
