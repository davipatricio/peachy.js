const Base = require("./Base");

class Interaction extends Base {
    constructor(client, data) {
        super(client, data.id)
    }
}

module.exports = Interaction