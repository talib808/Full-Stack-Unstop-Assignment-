// const express = require("express");
// const { connection } = require("./db");

// require("dotenv").config();
// const cors = require("cors");
// const { seatRouter } = require("./routes/routes");
// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// app.use("/seat", seatRouter);

// app.listen(process.env.Port, async () => {
//   try {
//     await connection;
//     console.log("Database Conneted");
//   } catch (error) {
//     console.log(error);
//   }
// });



const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const { connection } = require("./db");
require("dotenv").config();
const { seatRouter } = require("./routes/routes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/seat", seatRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Database Connected");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
