import { Executable, SessionConfig } from "../@types"
import sequence from "./promiseSequence"

/**
 * Combines the task objects from each provider uses the standard promise
 * generation sequence algorithm to execute them.
 */
export default (sessionConfigs: SessionConfig[]): Promise<unknown[]> => {
    const tasks: Executable[] = []
    for (const c of sessionConfigs) {
        tasks.push(...c.getExpandedTasks())
    }
    const makeTaskExecFunc = (task: Executable) => () => task.execute()
    return sequence<unknown>(tasks.map(makeTaskExecFunc))
}
