const mongoose = require("mongoose");
const dbURL = process.env.DATABASE;
const onlineDBURL = process.env.ONLINE_DATABASE;
mongoose.set("strictQuery", false);
mongoose
  .connect(onlineDBURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));
