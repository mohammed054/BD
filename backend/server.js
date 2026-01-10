const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const guestsRouter = require('./routes/guests');
const importRouter = require('./routes/import');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/items', itemsRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/import', importRouter);

app.get('/', (req, res) => {
  res.json({ message: 'BD Backend API - Camping/Party Organizer' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});