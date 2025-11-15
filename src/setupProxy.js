const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	// forward any /api/* request to the ngrok host
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'https://noneffusive-reminiscent-tanna.ngrok-free.dev',
			changeOrigin: true,
			secure: false, // ngrok uses HTTPS; set false if certificate issues
			logLevel: 'debug'
			// optional: onProxyReq to modify outgoing request headers if needed
		})
	);
};
