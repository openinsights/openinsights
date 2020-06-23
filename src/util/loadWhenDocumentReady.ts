/**
 * Utility to resolve a promise when the browsers ready state reaches "complete"
 */
export default function loadWhenReady(): Promise<void> {
    // If document is ready, resolve immediately
    if (document.readyState === "complete") {
        return Promise.resolve()
    }
    // Otherwise, attach event listener to resolve when ready
    return new Promise((resolve) => {
        document.addEventListener("readystatechange", (): void => {
            if (document.readyState === "complete") {
                resolve()
            }
        })
    })
}
