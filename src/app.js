const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("hi umashankar");
})

app.listen(3000, () => {
  console.log("Server is successfully listening to port 3000");
});
