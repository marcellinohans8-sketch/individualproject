const { UploadClient } = require("@uploadcare/upload-client");

const client = new UploadClient({
  publicKey: "fbb3b1b4925a68b45eb1",
  secretKey: "dff3cbeafccf4f630ef2",
});

module.exports = client;
