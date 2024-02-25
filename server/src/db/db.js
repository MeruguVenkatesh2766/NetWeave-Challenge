const mongoose = require("mongoose");
const dbURL = process.env.DATABASE;
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));
