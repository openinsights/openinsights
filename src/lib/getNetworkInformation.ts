import { Navigator, NetworkInformation } from "../@types"

/**
 * Gets the Network Intoformation API interface via the navigator.connection
 * global and clones the object as it is read only.
 */
export default function getNetworkInformation(): NetworkInformation {
    const navWithInfo = navigator as Navigator
    const connection = navWithInfo?.connection
    if (connection) {
        const res: NetworkInformation = {}
        /* eslint-disable guard-for-in */
        for (const prop in connection) {
            const type = typeof connection[prop]
            if (type === "number" || type === "string" || type === "boolean") {
                res[prop] = connection[prop]
            }
        }
        /* eslint-enable guard-for-in */
        return res
    }
    return {}
}
