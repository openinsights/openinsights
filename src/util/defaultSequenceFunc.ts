import { Executable, SessionConfig, SessionResult } from "../@types";
import sequence from "./promiseSequence";

/**
 * Combines the task objects from each provider uses the standard promise
 * generation sequence algorithm to execute them.
 */
export default (sessionConfigs: SessionConfig[]): Promise<SessionResult> => {
    const tasks: Executable[] = [];
    for (const c of sessionConfigs) {
        tasks.push(...c.getExpandedTasks());
    }
    const makeTaskExecFunc = (task: Executable) => () => task.execute();
    return sequence(tasks.map(makeTaskExecFunc)).then((testResults) => {
        return { testResults };
    });
};
