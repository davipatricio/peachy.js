'use strict';

const PermissionsBitfield = require('../constants/Permissions');

module.exports.parse = (bitfield) => {
	const final = [];
	for (const permission in PermissionsBitfield) {
		if ((PermissionsBitfield[permission] & bitfield) === PermissionsBitfield[permission]) {
			final.push(permission);
		}
	}

	return final;
};
