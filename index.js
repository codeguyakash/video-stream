const express = require("express");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    // If range header is not present, send the whole video
    const videoPath = "./video.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const headers = {
      "Content-Length": videoSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, headers);
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  const videoPath = "./video.mp4";
  const videoSize = fs.statSync(videoPath).size;

  const chunkSize = 0.04 * 10 ** 6; //200 KB data
  //   const chunkSize = 2 * 10 ** 6; //2 MB data
  console.log(chunkSize);
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`[Server Running ${PORT}]`);
});
