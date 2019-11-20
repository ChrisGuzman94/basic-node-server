const express = require("express");
const router = express.Router();
const ftpClient = require("ftp-client");
const config = {
  host: "ftpint.int.kn",
  port: 21,
  user: "tstngkqa",
  password: "e!J2QgMZ"
};
const client = new ftpClient(config, { logging: "debug" });
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, "file.csv");
  }
});

const upload = multer({ storage: storage }).single("file");
router.post("/", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    try {
      client.connect(function() {
        client.upload(
          ["public/**"],
          "/pub/inbound",
          {
            baseDir: "inbound",
            overwrite: "none"
          },
          function(result) {
            console.log(result);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send(req.file);
  });
});

module.exports = router;
