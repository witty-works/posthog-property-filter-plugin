const { createEvent } = require('@posthog/plugin-scaffold/test/utils')
const { processEvent } = require('.')

const global = { propertiesToFilter: ['gender', '$set.age', 'foo.bar.baz.one', 'nonExisting', '$set.$not_in_props'] }

const properties = {
    properties: {
        name: 'Mr. Hog',
        gender: 'male',
        $set: {
            age: 35,
            pet: 'dog',
            firstName: 'Post',
        },
        foo: {
            bar: {
                baz: {
                    one: 'one',
                    two: 'two',
                },
            },
        },
    },
}

test('event properties are filtered', async () => {
    const event = await processEvent(createEvent(properties), { global })
    expect(event.properties).not.toHaveProperty('gender')
    expect(event.properties.$set).not.toHaveProperty('age')
    expect(event.properties.foo.bar.baz).not.toHaveProperty('one')
    expect(event.properties).toHaveProperty('name')
    expect(event.properties).toHaveProperty('$set')
    expect(event.properties).toHaveProperty('foo')
    expect(event.properties.$set).toHaveProperty('firstName', 'Post')
    expect(event.properties.foo.bar.baz).toHaveProperty('two', 'two')
})
