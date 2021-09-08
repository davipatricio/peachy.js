module.exports.handle = function(client, data) {
	setTimeout(() => {
		client.emit('ready');
		client.ready = true;
	}, 5000).unref();
};
