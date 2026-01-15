// server.js - 完整版 CORS Anywhere for Render.com
// 支援環境變數 CORSANYWHERE_WHITELIST=* 來放寬限制

const corsAnywhere = require('cors-anywhere');
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

// 讀取環境變數 CORSANYWHERE_WHITELIST
// 如果設了，就用逗號分隔的列表；沒設就預設允許所有 ['*']
const originWhitelist = process.env.CORSANYWHERE_WHITELIST
  ? process.env.CORSANYWHERE_WHITELIST.split(',').map(s => s.trim())
  : ['*'];  // 預設允許所有來源（測試用）

// 建立 proxy 伺服器
corsAnywhere.createServer({
  originWhitelist: originWhitelist,          // 使用讀取到的白名單
  requireHeader: ['origin', 'x-requested-with'],  // 保留防濫用要求（可註解掉測試）
  // requireHeader: [],                      // 如果想完全關閉 header 要求，改成這行
  removeHeaders: ['cookie', 'cookie2'],      // 移除 cookie 防止追蹤
  redirectSameOrigin: true,                  // 自動處理同源重定向
  httpProxyOptions: {                        // 處理 HTTPS 等
    xfwd: true
  }
}).listen(port, host, function() {
  console.log('CORS Anywhere running on ' + host + ':' + port);
  console.log('Whitelist:', originWhitelist);  // debug 輸出，讓你確認是否讀到 *
  console.log('Require Header:', ['origin', 'x-requested-with']);  // 確認是否要求 header
});

// 輸出環境變數狀態（幫助 debug）
console.log('Environment CORSANYWHERE_WHITELIST:', process.env.CORSANYWHERE_WHITELIST || 'Not set');


{
  "name": "cors-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "cors-anywhere": "github:consumet/cors-anywhere#master",
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node server.js"
  }
}
