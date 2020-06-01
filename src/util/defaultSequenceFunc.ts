import { TaskInterface, SessionConfig } from "../@types"
import sequence from "./promiseSequence"

/**
 * Combines the task objects from each provider uses the standard promise
 * generation sequence algorithm to execute them.
 */
export default (sessionConfigs: SessionConfig[]): Promise<unknown[]> => {
    console.log(sessionConfigs)
    const tasks: TaskInterface[] = []
    for (const c of sessionConfigs) {
        tasks.push(...c.getExpandedTasks())
    }
    const makeTaskExecFun = (task: TaskInterface) => () => task.execute()
    return sequence<unknown>(tasks.map(makeTaskExecFun))
}
