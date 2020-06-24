import { Executable, PromiseSequenceFunc } from "../@types"
import sequence from "./promiseSequence"

/**
 * Default sequencing function. See {@link PromiseSequenceFunc} for more
 * details.
 *
 * @param sessionConfigs Array of {@link SessionConfig} objects from which to
 * generate a Promise<{@link SessionResult}>
 */
const defaultSequenceFunc: PromiseSequenceFunc = (sessionConfigs) => {
    const tasks: Executable[] = []
    for (const c of sessionConfigs) {
        tasks.push(...c.getExpandedTasks())
    }
    const makeTaskExecFunc = (task: Executable) => () => task.execute()
    return sequence(tasks.map(makeTaskExecFunc)).then((testResults) => {
        return { testResults }
    })
}

export default defaultSequenceFunc
