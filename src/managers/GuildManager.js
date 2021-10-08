"use strict";

const Guild = require("../structures/Guild");
const BaseManager = require("./BaseManager");

class GuildManager extends BaseManager {
  constructor(limit) {
    super(Guild, limit);
  }
}

module.exports = GuildManager;
