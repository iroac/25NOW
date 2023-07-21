const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://two5now-api.onrender.com',
            changeOrigin: true,
        })
    );
};