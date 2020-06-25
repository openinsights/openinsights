/**
 * Utility function for converting a string in camel case to snake case.
 * @param str Camel case input string
 */
export default function camelCaseToSnakeCase(str: string): string {
    return str
        .replace(/(?:^|\.?)([A-Z])/g, (x, y): string => "_" + y.toLowerCase())
        .replace(/^_/, "")
}
