const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = [
    { email: 'teacher@example.com', password: 'password123', userType: 'faculty' },
    { email: 'student@example.com', password: 'password123', userType: 'student' }
];

app.post('/api/login', (req, res) => {
    const { email, password, userType } = req.body;
    const user = users.find(user => user.email === email && user.password === password && user.userType === userType);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
