async function setupPlugin({ config, global }) {
    global.propertiesToFilter = new Set(config.properties.split(','))
}

async function processEvent(event, { global, storage }) {
    if (event.event === 'session_started') {
        return event
    }

    global.propertiesToFilter.forEach(async function (propertyToFilter) {
        if (propertyToFilter in event) {
            delete event[propertyToFilter]
        }

        if (event.properties && propertyToFilter in event.properties) {
            delete event.properties[propertyToFilter]
        }
    })

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}