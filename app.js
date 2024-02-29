const express = require("express");
const app = express();
const port = 3001

//middleware
app.use(express.json());

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

module.exports = app;