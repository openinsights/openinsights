/* eslint-disable max-len */
export default function makePerformanceTimingEntry(
    name: string,
    timestamps: {
        requestStart?: number
    } = {},
): PerformanceResourceTiming {
    const result = {
        name,
        entryType: "resource",
        startTime: 0,
        duration: 0,
        initiatorType: "foo",
        nextHopProtocol: "foo",
        workerStart: 0,
        redirectStart: 0,
        redirectEnd: 0,
        fetchStart: 0,
        domainLookupStart: 0,
        domainLookupEnd: 0,
        connectStart: 2,
        connectEnd: 3,
        secureConnectionStart: 0,
        requestStart: 100,
        responseStart: 0,
        responseEnd: 0,
        transferSize: 0,
        decodedBodySize: 0,
        encodedBodySize: 0,
        toJSON: () => "foo",
    }
    if (typeof timestamps.requestStart === "number") {
        result.requestStart = timestamps.requestStart
    }
    return result
}
