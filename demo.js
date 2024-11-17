const express = require('express');
const cors = require('cors');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');


class Order {
    constructor(number, date, device, problemType, description, client, status, employee) {
      this.number = number;
      this.date = date;
      this.device = device;
      this.problemType = problemType;
      this.description = description;
      this.client = client;
      this.status = status;
      this.employee = employee;
    }
  }
  let repo = [];
  repo.push(new Order(
    1, 
    "02-02-2005", 
    "Monitor", 
    "Сбой", 
    "help", 
    "Ivan Zolo", 
    "В ожидании", 
    "Коротаев А.А."));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/orders", (req, res) => {
  res.render("orders", { repo });
});
app.get("/orders/:number", (req, res) => {
  const number = parseInt(req.params.number);

  if (isNaN(number)) {
    return res.status(400).send("Invalid order number.");
  }
  const order = repo.find((o) => o.number === number);
  if (!order) {
    return res.status(404).send("Order not found.");
  }
  res.json(order); 
});
app.get("/ord/new", (req, res) => {
  res.render('new_order'); 
});

app.post("/ord", (req, res) => {
  
  const {
      number,
      date,
      device,
      problemType,
      description,
      client,
      status,
      employee 
  } = req.body;
  
  const orderNumber = parseInt(number);
  if (isNaN(orderNumber)) {
      return res.status(400).send('Некорректный номер заказа.');
  }

  const newOrder = new Order(
      orderNumber,
      date,
      device,
      problemType,
      description,
      client,
      status,
      employee 
  );
  repo.push(newOrder);
  res.send(newOrder);
  
});
app.get("/orders/:number/update", (req, res) => {
  const { number } = req.params;
  const orderIndex = repo.findIndex(order => order.number === parseInt(number));
  if (orderIndex === -1) {
    return res.status(404).send('Order not found');
  }
  res.render('update_order', { order: repo[orderIndex] }); 
});
app.post("/orders/:number", (req, res) => {
  const number = parseInt(req.params.number);
  if (isNaN(number)) {
    return res.status(400).send("некорректный номер");
  }

  const orderIndex = repo.findIndex((order) => order.number === number);
  if (orderIndex === -1) {
    return res.status(404).send("Заявка не найдена");
  }

  const { description, status, employee } = req.body;

  if (!description || !status || !employee) {
    return res.status(400).send("не все поля заполнены");
  }

  
  repo[orderIndex].description = description;
  repo[orderIndex].status = status;
  repo[orderIndex].employee = employee;


  res.json(repo[orderIndex]);
});

app.listen(7007);