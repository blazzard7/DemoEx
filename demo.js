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
app.listen(7007);