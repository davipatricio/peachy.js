'use strict';

const PermissionsBitfield = require('../constants/Permissions');

/** */
class Permissions extends null {
  /**
   * @param {number} [bitfield=0] - Bitfield of permissions to parse
   * @returns {Array<string>} - Array of permission names
   */
  static parse(bitfield = 0) {
    const final = [];

    for (const permission in PermissionsBitfield) {
      if ((PermissionsBitfield[permission] & bitfield) === PermissionsBitfield[permission]) {
        final.push(permission);
      }
    }

    return final;
  }
}

module.exports = Permissions;
