const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());


// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  database: 'data1',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  // Sample MySQL query
  connection.query('SELECT * FROM student', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});


// Register a new user
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  connection.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log('User registered successfully:', result);
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user data from the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], async (err, result) => {
      if (err) {
        console.error('Error retrieving user data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Check if the user exists
        if (result.length === 0) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Compare passwords
        const match = await bcrypt.compare(password, result[0].password);
        if (!match) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: result[0].id, username: result[0].username, email: result[0].email }, 'your-secret-key', {
          expiresIn: '1h',
        });

        res.status(200).json({ token });
        console.log("User Login Successfully")
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected route - Retrieve user information after authentication
app.get('/api/user', (req, res) => {
  // The user's information is available in the request object after authentication
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});






