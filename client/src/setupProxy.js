const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://25now-api.vercel.app',
            changeOrigin: true,
        })
    );
};