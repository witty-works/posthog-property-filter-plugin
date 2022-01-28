async function setupPlugin({ config, global }) {
    global.propertiesToFilter = config.properties.split(',')
}

async function processEvent(event, { global, storage }) {
    global.propertiesToFilter.forEach(async function (propertyToFilter) {
        if (propertyToFilter === '$ip') {
            delete event.ip
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