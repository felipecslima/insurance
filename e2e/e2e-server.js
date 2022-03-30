const express = require("express");
const app = express();
const baseUrl = '/';

app.listen(3000);
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "PUT, DELETE, GET, POST");
  res.header("Access-Control-Allow-Credentials", "true");
  if ('OPTIONS' === req.method) {
    res.status(200).end();  // For OPTIONS requests, a 200 response is sent immediately
  } else {
    next();  // Continues normal workflow
  }
});

console.log('================================');
console.log('WEB-SERVICES MOCK INICIALIZADOS');
console.log('================================');

const persons = require('./routes/persons');
/**
 * Authentication
 */
app.post(baseUrl + 'persons/login', (req, res) => persons.login(req, res));
app.get(baseUrl + 'persons/self', (req, res) => persons.self(req, res));
app.get(baseUrl + 'persons', (req, res) => persons.get(req, res));

/**
 * Auction
 */

// const auctions = require('./routes/auctions');
//
// app.get(baseUrl + 'auctions', (req, res) => auctions.get(req, res));
// app.get(baseUrl + 'auctions/:id', (req, res) => auctions.get(req, res));
// app.post(baseUrl + 'auctions', (req, res) => auctions.post(req, res));
// app.put(baseUrl + 'auctions/:id', (req, res) => auctions.put(req, res));
// app.delete(baseUrl + 'auctions/:id', (req, res) => auctions.delete(req, res));
