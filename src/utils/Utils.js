const isConstructor = (classe, ...params) => {
  try {
    new classe(params);
    return true;
  } finally {
    return false;
  }
};

const censureToken = token => {
  var tokenSplit = token.split('.');
  var censuredToken = token.slice(0, tokenSplit[0].length);
  var tokenNotCensured = tokenSplit.slice(1).join('');

  for (var i = 0; i < tokenNotCensured.length + 1; i++) {
    censuredToken += '*';
  }

  return `${censuredToken + "**"}`;
};

module.exports = {
  Cache: require('./CacheFactory'),
  CheckAPIError: require('./CheckAPIError'),
  Intents: require('./Intents'),
  MakeAPIMessage: require('./MakeAPIMessage'),
  Requester: require('./Requester'),
  isConstructor,
  censureToken,
  PermissionParser: require("./PermissionParser")
};

module.exports.LimitedMap = require('./LimitedMap');
