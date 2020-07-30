import loadWhenDocumentReady from "./loadWhenDocumentReady"

describe("loadWhenDocumentReady", () => {
    test("readyState complete initially", () => {
        return loadWhenDocumentReady().then(() => {
            // do nothing
        })
    })
    test("readyState loading initially", (done) => {
        let calls = 0
        Object.defineProperty(document, "readyState", {
            get() {
                let result: "complete" | "loading" = "loading"
                if (++calls > 2) {
                    result = "complete"
                }
                return result
            },
        })
        loadWhenDocumentReady().then(() => {
            done()
        })
        document.dispatchEvent(new Event("readystatechange"))
        document.dispatchEvent(new Event("readystatechange"))
    })
})
