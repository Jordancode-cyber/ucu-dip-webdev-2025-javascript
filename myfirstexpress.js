//Import express
const express = require('express');
const app = express();
const port = 3000;

//Middelware to parse JSON bodies
app.use(express.json());

//Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

//start server
app.listen(port, () => {
  console.log('Server running at http://localhost:${port}/');
});
