const express = require('express');
const cors = require('cors'); 
const app = express();
const jsonInterpretator = express.json();
class Order {
    constructor(number, date, device, problemType, description, client, status) {
      this.number = number;
      this.date = date;
      this.device = device;
      this.problemType = problemType;
      this.description = description;
      this.client = client;
      this.status = status;
    }
  }
let repo = [
  {
    number: 1,
    date: "02-02-2005",
    device: "Monitor",
    problemType: "Сбой",
    description: "help",
    client: "Ivan Zolo",
    status: "В ожидании"    
   }
];
  
app.use(cors()); 
app.get("/orders", (req, res) => {
res.send(repo);
});
app.post("/ord", jsonInterpretator, (req, res) => {
const {
        number,
        date,
        device,
        problemType,
        description,
        client,
        status,
    } = req.body;

const newOrder = new Order(
    number,
    date,
    device,
    problemType,
    description,
    client,
    status
  );
  repo.push(newOrder);
  res.send(newOrder);
});
app.listen(7007);
app.listen(7007);