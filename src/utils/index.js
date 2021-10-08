module.exports.isConstructor = (classe, ...params) => {
    try {
        new classe(params)
        return true
    } finally {
        return false
    }
}

module.exports = {
    Cache: require("./Cache"),
    CheckAPIError: require("./CheckAPIError"),
    Intents: require("./Intents"),
    LimitedMap: require("./LimitedMap"),
    MakeAPIMessage: require("./MakeAPIMessage"),
    Requester: require("./Requester")
}