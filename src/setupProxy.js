const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'https://api.shl-hr.com',
			changeOrigin: true,
			secure: false,
			onProxyReq: (proxyReq, req, res) => {
				// Extract token from query params and set Authorization header
				const parsedUrl = url.parse(req.url, true);
				const token = parsedUrl.query.token;
				if (token) {
					proxyReq.setHeader('Authorization', `Bearer ${token}`);
					console.log('Added Authorization header with token from query param');
				}
				// Add ngrok bypass header
				proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
			},
			logLevel: 'debug'
		})
	);
};
