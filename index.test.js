const { createEvent } = require('@posthog/plugin-scaffold/test/utils')
const { processEvent } = require('.')

const global = { 
    propertiesToFilter: [
        'gender',
        '$set.age',
        'foo.bar.baz.one',
        'nonExisting'
    ],
    setPropertiesToFilter: [
        '$geoip_city_name'
    ],
    setOncePropertiesToFilter: [
        '$initial_geoip_country_name'
    ]
}

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
    $set: {
        $geoip_city_name: "Linköping",
        $geoip_subdivision_1_name: "Östergötland County",
    },
    $set_once: {
        $initial_geoip_country_name: "Sweden",
        $initial_geoip_continent_name: "Europe",
    }
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

    expect(event.$set).not.toHaveProperty('$geoip_city_name')
    expect(event.$set).toHaveProperty('$geoip_subdivision_1_name')

    expect(event.$set_once).not.toHaveProperty('$initial_geoip_country_name')
    expect(event.$set_once).toHaveProperty('$initial_geoip_continent_name')
})

const emptyProperties = {}

test('event properties are empty when no properties are given', async () => {
    const event = await processEvent(createEvent(emptyProperties), { global })

    expect(event.properties).not.toHaveProperty('$set')
    expect(event.properties).not.toHaveProperty('foo')
})
