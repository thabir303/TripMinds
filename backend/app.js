const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const itineraryRoutes = require('./routes/itineraryRoutes');

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use('/api', itineraryRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
