import { SimpleObject } from "."

describe("Types", () => {
    test("SimpleObject", () => {
        const someNumber = 123
        const someString = "abc"
        const someBoolean = true
        const someNullValue = null
        const someUndefinedValue = undefined
        const someArrayOfStrings: Array<string> = ["a", "b", "c"]
        const someHeterogeneousArray = ["a", 123, true, null]
        const someArrayOfSimpleObjects: Array<SimpleObject> = [
            {
                a: 123,
            },
            {
                b: "foo",
            },
        ]
        const someSimpleObject = {
            someNumber,
            someString,
            someBoolean,
            someNullValue,
            someUndefinedValue,
            someArrayOfStrings,
            someHeterogeneousArray,
            someArrayOfSimpleObjects,
        }
        const outerObject: SimpleObject = {
            someNumber,
            someString,
            someBoolean,
            someNullValue,
            someUndefinedValue,
            someSimpleObject,
        }
        const deserialized = JSON.parse(JSON.stringify(outerObject))
        expect(deserialized.someNumber).toEqual(someNumber)
        expect(deserialized.someSimpleObject.someNullValue).toBeNull()
        expect(deserialized.someSimpleObject.someArrayOfStrings).toEqual(
            someArrayOfStrings,
        )
        expect(deserialized.someSimpleObject.someHeterogeneousArray).toEqual(
            someHeterogeneousArray,
        )
        expect(deserialized.someSimpleObject.someArrayOfSimpleObjects).toEqual(
            someArrayOfSimpleObjects,
        )
    })
})
