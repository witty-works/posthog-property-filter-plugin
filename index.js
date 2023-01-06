async function setupPlugin({ config, global }) {
    global.propertiesToFilter = config.properties.split(',')
}

function recursiveFilterObject(properties, propertyToFilter) {
    const propertyToFilterCopy = [...propertyToFilter]
    const currentPropertyToFilter = propertyToFilterCopy.shift()
    let parsedProperties = {}

    if (propertyToFilterCopy.length && properties[currentPropertyToFilter]) {
        parsedProperties = recursiveFilterObject(properties[currentPropertyToFilter], propertyToFilterCopy)
    } else if (currentPropertyToFilter in properties) {
        parsedProperties = { ...properties }
        delete parsedProperties[currentPropertyToFilter]
    } else {
        parsedProperties = { ...properties }
    }

    return propertyToFilterCopy.length ? { [currentPropertyToFilter]: parsedProperties } : parsedProperties
}

async function processEvent(event, { global }) {
    let propertiesCopy = event.properties ? { ...event.properties } : {}

    // filter items from top level $set
    const setPropsToFilter = global.propertiesToFilter.filter(prop => prop.includes('$set'))
    if (event.$set && setPropsToFilter.length > 0) {
        let setPropCopy = {...event.$set }
        for (const propertyToFilter of setPropsToFilter) {
            let propKeyToFilter = propertyToFilter.split('.').pop()
            delete setPropCopy[propKeyToFilter]
        }
        event.$set = setPropCopy
    }

    // filter items from top level $set_once
    const setOncePropsToFilter = global.propertiesToFilter.filter(prop => prop.includes('$set_once'))
    if (event.$set_once && setOncePropsToFilter.length > 0) {
        let setOncePropCopy = {...event.$set_once }
        for (const propertyToFilter of setOncePropsToFilter) {
            let propKeyToFilter = propertyToFilter.split('.').pop()
            delete setOncePropCopy[propKeyToFilter]
        }
        event.$set_once = setOncePropCopy
    }

    for (const propertyToFilter of global.propertiesToFilter) {
        if (propertyToFilter === '$ip') {
            delete event.ip
        }

        if (Object.keys(propertiesCopy).length > 0 && propertyToFilter.includes('.')) {
            propertiesCopy = {
                ...propertiesCopy,
                ...recursiveFilterObject(propertiesCopy, propertyToFilter.split('.')),
            }
        } else if (propertyToFilter in propertiesCopy) {
            delete propertiesCopy[propertyToFilter]
        }
    }

    return { ...event, properties: propertiesCopy }
}

module.exports = {
    setupPlugin,
    processEvent,
}
