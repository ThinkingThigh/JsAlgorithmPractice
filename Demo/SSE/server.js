const http = require("http");
const fs = require("fs");

// Create a server
const server = http.createServer();

// 监听路由
server.on("request", (req, res) => {
  console.log("request", req.url);
  if (req.url === "/sse") {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");

    // 模拟收到消息推送给客户端
    let data =
      "好未来(NYSE:TAL)是一家以打造创新型组织为目标的科技公司,我们致力于通过科技、产品和内容创新,以助力人的终身成长为使命,推动行业持续进化与健康发展,给社会带来增量价值。 ";
    let arr = data.split("");
    console.log(arr);
    let i = 0;
    let interval = setInterval(function () {
      console.log(arr[i]);
      res.write("data: " + arr[i] + "\n\n");
      i++;
      if (i >= arr.length) {
        clearInterval(interval);
      }
    }, 300);
  }

  if (req.url === "/index.html" || req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    const html = fs.readFileSync("./index.html");
    res.end(html);
  }

});

// Listen
server.listen(8001, () => {
  console.log("Server started on port 8001");
});
