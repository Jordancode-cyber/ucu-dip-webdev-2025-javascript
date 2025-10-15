const express = require('express')
const app = express()
const port = 3000

//Middelware to parse JSON bodies
app.use(express.json());

//Basic route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Example app listening on port ${port}')
})
//start server
app.listen(port, () => {
  console.log('Server running at http://localhost:${port}/');
});
//Route to handle GET requests
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});