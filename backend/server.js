const http = require("http");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "..", "frontend");
const mime = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "text/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject"
};
const server = http.createServer((req, res) => {
  const urlPath = decodeURI(req.url.split("?")[0]);
  const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, "");
  const filePath = safePath === "/" ? path.join(publicDir, "index.html") : path.join(publicDir, safePath);
  if (!filePath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      fs.stat(indexPath, (err2) => {
        const finalPath = err2 ? filePath : indexPath;
        fs.readFile(finalPath, (err3, data) => {
          if (err3) {
            res.statusCode = 500;
            res.end("Server Error");
            return;
          }
          const ext = path.extname(finalPath).toLowerCase();
          res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
          res.end(data);
        });
      });
      return;
    }
    fs.readFile(filePath, (err4, data) => {
      if (err4) {
        res.statusCode = 500;
        res.end("Server Error");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
      res.end(data);
    });
  });
});
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
