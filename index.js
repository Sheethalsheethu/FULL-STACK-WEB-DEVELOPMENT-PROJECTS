import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import pg from 'pg';

const app = express();
const port = 3000;


// Set EJS as the view engine
app.set('view engine', 'ejs');


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "tourism database management",
  password: "2003",
  port: 5432,
});



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



// Connect to PostgreSQL database
db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));

 
// GET route to render the form
app.get('/', (req, res) => {
  res.render('index.ejs', { agent: null }); // Pass agent as null initially
});


// GET route to render the fetch.ejs file
app.get('/fetch', (req, res) => {
  res.render('fetch');
});

// GET route to render the add.ejs file
app.get('/add', async (req, res) => {
  try {
    // Query the database to get the count of insertions
    const result = await db.query('SELECT COUNT(*) AS count FROM insertions');
    const insertionCount = result.rows[0].count;

    // Render the add.ejs file with the insertionCount variable
    res.render('add', { insertionCount });
  } catch (error) {
    console.error('Error retrieving insertion count:', error);
    res.status(500).send('Internal Server Error');
  }
});


// POST route to handle form submission and fetch user data
app.post('/submit', async (req, res) => {
  const { user_id } = req.body;

  // Validate user_id (check if it's a valid number and has at most 4 digits)
  if (!/^\d{1,4}$/.test(user_id)) {
    return res.render('fetch.ejs', { user_name: null, user_phone: null, error: 'Invalid user ID' });
  }

  console.log('Received form submission with user_id:', user_id);

  try {
    // Fetch user data from the database
    const query = 'SELECT "user_name", "user_phone" FROM "User" WHERE "user_id" = $1';
    console.log('Executing SQL query:', query);
    const result = await db.query(query, [user_id]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      // User not found
      console.log('User not found');
      res.render('fetch.ejs', { user_name: null, user_phone: null, agent: null, error: 'User not found' });
    } else {
      // User found, render the data
      const { user_name, user_phone } = result.rows[0];
      console.log('User data:', user_name, user_phone);
      res.render('fetch.ejs', { user_name, user_phone, agent: null, error: null });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

// POST route to handle form submission and fetch user data
app.post('/agent', async (req, res) => {
  const { agent_id } = req.body;

  // Validate user_id (check if it's a valid number and has at most 4 digits)
  if (!/^\d{1,4}$/.test(user_id)) {
    return res.render('fetch.ejs', { user_name: null, user_phone: null, error: 'Invalid agent ID' });
  }

  console.log('Received form submission with agent_id:', agent_id);

  try {
    // Fetch user data from the database
    const query = 'SELECT "agent_name" ,"agent_phone","user_id" FROM "travelagent" WHERE "agent_id" = $1';
    console.log('Executing SQL query:', query);
    const result = await db.query(query, [agent_id]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      // User not found
      console.log('User not found');
      res.render('fetch.ejs', { agent_name: null, agent_phone: null, user_id: null, agent: null, error: 'Agent not found' });
    } else {
      // User found, render the data
      const { agent_name, agent_phone, user_id } = result.rows[0]; // Fix variable names here
      console.log('Agent data:', agent_name, agent_phone, user_id);
      res.render('fetch.ejs', { agent_name, agent_phone, user_id, agent: null, error: null }); // Fix variable names here
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


// POST route to handle agent submission
app.post('/booking', async (req, res) => {
  const { book_id } = req.body;

  // Validate user_id (check if it's a valid number and has at most 4 digits)
  if (!/^\d{1,4}$/.test(user_id)) {
    return res.render('fetch.ejs', { user_name: null, user_phone: null, error: 'Invalid booking ID' });
  }

  console.log('Received booking submission with book_id:', book_id);

  try {
    // Fetch booking data from the database
    const query = 'SELECT "book_type", "user_id", "book_date", "book_cost" FROM "booking" WHERE "book_id" = $1';
    console.log('Executing SQL query:', query);
    const result = await db.query(query, [book_id]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      // Booking not found
      console.log('Booking not found');
      res.render('fetch.ejs', { book_type: null, user_id: null, book_date: null, book_cost: null, error: 'Booking not found' });
    } else {
      // Booking found, render the data
      const { book_type, user_id, book_date, book_cost } = result.rows[0];
      console.log('Booking data:', book_type, user_id, book_date, book_cost);
      res.render('fetch.ejs', { book_type, user_id, book_date, book_cost, error: null });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


// POST route to handle agent submission
app.post('/hotel', async (req, res) => {
  const { hotel_id } = req.body;

  // Validate user_id (check if it's a valid number and has at most 4 digits)
  if (!/^\d{1,4}$/.test(user_id)) {
    return res.render('fetch.ejs', { user_name: null, user_phone: null, error: 'Invalid hotel ID' });
  }

  console.log('Received form submission with hotel_id:', hotel_id);

  try {
    // Fetch hotel data from the database
    const query = 'SELECT "hotel_name", "hotel_desc", "hotel_type" FROM "hotel" WHERE "hotel_id" = $1';
    console.log('Executing SQL query:', query);
    const result = await db.query(query, [hotel_id]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      // Hotel not found
      console.log('Hotel not found');
      res.render('fetch.ejs', { hotel_name: null, hotel_desc: null, hotel_type: null, agent: null, error: 'Hotel not found' });
    } else {
      // Hotel found, render the data
      const { hotel_name, hotel_desc, hotel_type } = result.rows[0];
      console.log('Hotel data:', hotel_name, hotel_desc, hotel_type);
      res.render('fetch.ejs', { hotel_name, hotel_desc, hotel_type, agent: null, error: null });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to handle form submission and fetch user data
app.post('/packages', async (req, res) => {
  const { pack_id } = req.body;

  // Validate user_id (check if it's a valid number and has at most 4 digits)
  if (!/^\d{1,4}$/.test(user_id)) {
    return res.render('fetch.ejs', { user_name: null, user_phone: null, error: 'Invalid package ID' });
  }

  console.log('Received form submission with pack_id:', pack_id);

  try {
    // Fetch user data from the database
    const query = 'SELECT "pack_desc", "pack_cost", "book_id", "hotel_id" FROM "packages" WHERE "pack_id" = $1';
    console.log('Executing SQL query:', query);
    const result = await db.query(query, [pack_id]);

    console.log('Query result:', result.rows);

    if (result.rows.length === 0) {
      // User not found
      console.log('Package not found');
      res.render('fetch.ejs', { pack_desc: null, pack_cost: null, book_id: null, hotel_id: null, error: 'Package not found' });
    } else {
      // User found, render the data
      const { pack_desc, pack_cost, book_id, hotel_id } = result.rows[0];
      console.log('Package data:', pack_desc, pack_cost, book_id, hotel_id);
      res.render('fetch.ejs', { pack_desc, pack_cost, book_id, hotel_id, error: null });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Route to render form for adding data to the User table
app.get('/add/user', (req, res) => {
  res.render('add_user.ejs');
});


// Route to handle form submission and add data to the User table
app.post('/add/user', async (req, res) => {
  const { user_id, user_name, user_phone } = req.body;

  try {
    const insertQuery = 'INSERT INTO "User" (User_ID, User_Name, User_Phone) VALUES ($1, $2, $3)';
    await db.query(insertQuery, [user_id, user_name, user_phone]);
    insertionCount++;
    res.send('User data added successfully!');
  } catch (error) {
    console.error('Error adding user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render form for adding data to the TravelAgent table
app.get('/add/agent', (req, res) => {
  res.render('add_agent.ejs');
});

// Route to handle form submission and add data to the TravelAgent table
app.post('/add/agent', async (req, res) => {
  const { agent_id, agent_name, agent_phone, user_id } = req.body;

  try {
    const insertQuery = 'INSERT INTO TravelAgent (Agent_ID, Agent_Name, Agent_Phone, User_ID) VALUES ($1, $2, $3, $4)';
    await db.query(insertQuery, [agent_id, agent_name, agent_phone, user_id]);
    res.send('Travel agent data added successfully!');
  } catch (error) {
    console.error('Error adding travel agent data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render form for adding data to the Packages table
app.get('/add/package', (req, res) => {
  res.render('add_package.ejs');
});

// Route to handle form submission and add data to the Packages table
app.post('/add/package', async (req, res) => {
  const { pack_id, pack_desc, pack_cost, book_id, hotel_id } = req.body;

  try {
    const insertQuery = 'INSERT INTO Packages (Pack_ID, Pack_Desc, Pack_Cost, Book_ID, Hotel_ID) VALUES ($1, $2, $3, $4, $5)';
    await db.query(insertQuery, [pack_id, pack_desc, pack_cost, book_id, hotel_id]);
    res.send('Package data added successfully!');
  } catch (error) {
    console.error('Error adding package data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render form for adding data to the Hotel table
app.get('/add/hotel', (req, res) => {
  res.render('add_hotel.ejs');
});

// Route to handle form submission and add data to the Hotel table
app.post('/add/hotel', async (req, res) => {
  const { hotel_id, hotel_name, hotel_desc, hotel_type } = req.body;

  try {
    const insertQuery = 'INSERT INTO Hotel (Hotel_ID, Hotel_Name, Hotel_Desc, Hotel_Type) VALUES ($1, $2, $3, $4)';
    await db.query(insertQuery, [hotel_id, hotel_name, hotel_desc, hotel_type]);
    res.send('Hotel data added successfully!');
  } catch (error) {
    console.error('Error adding hotel data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render form for adding data to the Booking table
app.get('/add/booking', (req, res) => {
  res.render('add_booking.ejs');
});

// Route to handle form submission and add data to the Booking table
app.post('/add/booking', async (req, res) => {
  const { book_id, book_type, user_id, book_date, book_cost } = req.body;

  try {
    const insertQuery = 'INSERT INTO Booking (Book_ID, Book_Type, user_id, Book_Date, Book_Cost) VALUES ($1, $2, $3, $4, $5)';
    await db.query(insertQuery, [book_id, book_type, user_id, book_date, book_cost]);
    res.send('Booking data added successfully!');
  } catch (error) {
    console.error('Error adding booking data:', error);
    res.status(500).send('Internal Server Error');
  }
});




let insertionCount = 0;

// Function to retrieve insertion count from the database on server start
async function initializeInsertionCount() {
    try {
        // Query the database to get the current insertion count
        const result = await db.query('SELECT COUNT(*) FROM "User"');
        insertionCount = result.rows[0].count;
    } catch (error) {
        console.error('Error initializing insertion count:', error);
    }
}

// Initialize insertion count when the server starts
initializeInsertionCount();

// Route to handle form submission and add data to the User table
app.post('/add/user', async (req, res) => {
    const { user_id, user_name, user_phone } = req.body;

    try {
        const insertQuery = 'INSERT INTO "User" (User_ID, User_Name, User_Phone) VALUES ($1, $2, $3)';
        await db.query(insertQuery, [user_id, user_name, user_phone]);
        insertionCount++; // Increment the insertion count
        res.send('User data added successfully!');
    } catch (error) {
        console.error('Error adding user data:', error);
        res.status(500).send('data cannot be added');
    }
});

// Route to get the insertion count
app.get('/insertion/count', (req, res) => {
    res.json({ count: insertionCount });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
