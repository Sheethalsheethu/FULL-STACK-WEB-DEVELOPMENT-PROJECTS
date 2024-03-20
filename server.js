const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tourism database management",
  password: "2003",
  port: 5432,
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route handler for the root path ("/")
app.get('/', (req, res) => {
  // Render the index.ejs file as the response
  res.render('main');
});

// Handle form submission
app.post('/insert', (req, res) => {
  const { user_id, user_name, user_phone } = req.body;
  // Insert data into the database
  pool.query('INSERT INTO User (user_id, user_name, user_phone) VALUES ($1, $2, $3)', [user_id, user_name, user_phone], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.send('Error inserting data');
    } else {
      console.log('Data inserted successfully');
      res.send('Data inserted successfully');
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
