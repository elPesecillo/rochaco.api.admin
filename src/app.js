const dotenv = require("dotenv");
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");

dotenv.config();

const { connectDb } = require("./models");
const router = require("./routes/router");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(express.json());
app.use(cors());

app.use(logger('dev'));
app.use('/', router);

connectDb();

module.exports = app;
