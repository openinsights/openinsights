// getNetworkInformation gets the Network Intoformation API interface via the

import { Navigator, NetworkInformation } from "../@types";

// navigator.connection global and clones the object as it is read only.
export default function getNetworkInformation(): NetworkInformation {
    const navWithInfo = navigator as Navigator;
    const connection = navWithInfo && navWithInfo.connection;
    if (connection) {
        const res: NetworkInformation = {};
        /* eslint-disable guard-for-in */
        for (const prop in connection) {
            const type = typeof connection[prop];
            if (type === "number" || type === "string" || type === "boolean") {
                res[prop] = connection[prop];
            }
        }
        return res;
    }
    return {};
}
