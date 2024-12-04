const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// ... rest of your server code 