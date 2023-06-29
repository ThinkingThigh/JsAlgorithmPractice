let timerId;

self.onmessage = function (event) {
  const { speed } = event.data;
  if (event.data.type === "start") {
    const startTime = Date.now();
    while (true) {
      const now = Date.now();
      if (now - startTime >= speed) {
        console.log("误差", now - startTime - speed);
        let real = now - startTime;
        let diff = now - startTime - speed;
        self.postMessage({ real, diff });
        return;
      }
    }
  } else if (event.data.type === "stop") {
  }
};
