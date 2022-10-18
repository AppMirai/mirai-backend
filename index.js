const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Route Documentation
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Static Routes
app.use('/public', express.static('public'))

app.listen(process.env.APP_PORT || 5000, () => console.log("🚀 Mirai API Ready On Port 5000"));