const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 服务静态文件
app.use(express.static(path.join(__dirname)));

// 默认路由返回index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log(`访问鼠标按键测试页面: http://localhost:${port}`);
});