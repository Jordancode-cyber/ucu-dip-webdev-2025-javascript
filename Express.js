const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // middleware to parse JSON bodies

let user = [
    {id: 1, name: "Daniel"},
    {id: 2, name: "Morgan"},
    {id: 3, name: "Glosh"}
];

// Get all users
app.get('/users', (req, res) => {
    res.json(user);
}); 

// Get user by id
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foundUser = user.find(u => u.id === id);
    if (foundUser) {
        res.json(foundUser);
    } else {
        res.status(404).json({message: "User not found"});
    }
});

// Post new user
app.post('/users', (req, res) => {
    const newUser = {
        id: user.length + 1,
        name: req.body.name
    };
    user.push(newUser);
    res.status(201).json(newUser);
});

// Put update user
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const foundUser = user.find(u => u.id === id);
    if (foundUser) {
        foundUser.name = req.body.name;
        res.json(foundUser);
    } else {
        res.status(404).json({message: "User not found"});
    }
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    user = user.filter(u => u.id !== id);
    res.json({message: "User deleted successfully"});
});

// Search route
app.get('/search', (req, res) => {
    const query = req.query.q;
    res.json({message: `You searched for: ${query}`});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});