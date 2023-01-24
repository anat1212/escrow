const express = require("express"); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
app.use(express.json());

let escrowStorage = [[], []];

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get("/express_backend", (req, res) => {
  console.log("-------------------");
  console.log(req.body);
  //Line 9
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" }); //Line 10
}); //Line 11

app.post("/express_backend", async (req, res) => {
  console.log("reseved-------------------");
  console.log(req.body.a);
  if (req.body.a.length > 0) {
    escrowStorage.push(req.body.a);
  }
  console.log("send-------------------");
  console.log(escrowStorage[escrowStorage.length - 1]);
  //Line 9
  res.send({ express: escrowStorage[escrowStorage.length - 1] }); //Line 10
}); //Line 11
