const express = require('express');
const cors = require('cors');
const path = require('path'); 
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 


class Order {
    constructor(number, date, device, problemType, description,comment, client, status, employee) {
      this.number = number;
      this.date = date;
      this.device = device;
      this.problemType = problemType;
      this.description = description;
      this.comment = comment;
      this.client = client;
      this.status = status;
      this.employee = employee;
      
    }
  }
  let repo = [{
    number: 1,
    date: "02-02-2005",
    device:"PC",
    ProblemType: "Не включается",
    description: "Не работает",
    status: "в ожидании",
    employee: "Илон Маск",
    description: "Помогите",
    comment: "пж",
    client: "Иван Золо",
    
    
  }];


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
      comment,
      client,
      status,
      employee,
      
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
      comment,
      client,
      status,
      employee,
      
  );
  repo.push(newOrder);
  res.send(newOrder);
  
});
app.get("/orders/:number/update", (req, res) => {
  const { number } = req.params;
  const orderIndex = repo.findIndex(order => order.number === parseInt(number));
  if (orderIndex === -1) {
    return res.status(404).send('заявка не найдена');
  }
  res.render('update_order', { order: repo[orderIndex] }); 
});

app.post("/orders/:number", (req, res) => {
  const number = parseInt(req.params.number);
  if (isNaN(number) || number <= 0) {
    return res.status(400).json({ error: "инвалидный номер заявки", success: false });
  }

  const orderIndex = repo.findIndex((order) => order.number === number);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Заявка не найдена", success: false });
  }

  const { description, status, employee, comment } = req.body; 
  const allowedStatuses = ["в ожидании", "в работе", "выполнено"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Инвалид статус", success: false });
  }

  const previousStatus = repo[orderIndex].status;
    const now = new Date();

    repo[orderIndex].description = description;
    repo[orderIndex].employee = employee;
    repo[orderIndex].comment = comment;
    repo[orderIndex].updatedAt = now;

    if (status === "в работе" && previousStatus !== "в ожидании") {
        repo[orderIndex].startedAt = now; 
    } else if (status === "выполнено" && previousStatus === "в работе") {
        repo[orderIndex].completedAt = now; 
    }

    repo[orderIndex].status = status;

    res.json({
        order: repo[orderIndex],
        statusChange: previousStatus !== status,
        orderNumber: repo[orderIndex].number,
        status: status,
        success: true
    });
});
app.get("/search", (req, res) => {
  const { num, param } = req.query;
  let results = [];

  if (num) {
      const number = parseInt(num);
      if (!isNaN(number)) {
          const order = repo.find(order => order.number === number);
          if (order) results.push(order);
      }
  } else if (param) {
      results = repo.filter(order => Object.values(order).some(value => typeof value === 'string' && value.toLowerCase().includes(param.toLowerCase())));
  }

  res.render("search", { orders: results }); 
});

app.get("/search_form", (req, res) => {
  res.render("search_form");
});
app.get('/stats', (req, res) => {
  const completedCount = repo.filter(order => order.status === "выполнено").length;
  const problemCounts = {};
  repo.forEach(order => {
      const problemType = order.ProblemType; 
      problemCounts[problemType] = (problemCounts[problemType] || 0) + 1;
  });

  res.render('stats',{ completedCount, problemCounts });
});

app.listen(7007);