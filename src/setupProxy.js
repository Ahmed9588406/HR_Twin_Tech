const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://noneffusive-reminiscent-tanna.ngrok-free.dev',
      changeOrigin: true,
      secure: false,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
  );
};
