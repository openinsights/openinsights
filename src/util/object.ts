/* eslint-disable
    @typescript-eslint/explicit-module-boundary-types,
    @typescript-eslint/no-explicit-any,
*/
/**
 * Utility function to test whether an object has own nested property. This is
 * used instead of Object.prototype.hasOwnProperty() due to browser support.
 * @param obj
 * @param propertyPath Object path in dot notation form
 */
export function hasProperty(obj: any, propertyPath: string): boolean {
    // TODO: this is the only place we use split(). can we avoid this?
    return propertyPath.split(".").every((prop: string): boolean => {
        let hasProp: boolean
        try {
            hasProp = obj.hasOwnProperty(prop)
        } catch (e) {
            hasProp = !(
                typeof obj !== "object" ||
                obj === null ||
                !(prop in obj) ||
                typeof obj[prop] === "undefined"
            )
        }

        if (hasProp) {
            obj = obj[prop]
        }

        return hasProp
    })
}

/**
 * Utility to test whether an object has all nested properties within a list
 * @param obj
 * @param properties
 */
export function hasProperties(obj: any, properties: string[]): boolean {
    let hasProps
    // Try/catch is used to guard against lack of .every() support
    try {
        hasProps = properties.every((prop): boolean => hasProperty(obj, prop))
    } catch (e) {
        hasProps = false
    }
    return hasProps
}
