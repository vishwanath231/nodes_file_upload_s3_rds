import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import MainRouter from './router/router.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import bodyParser from 'body-parser';
import cors from 'cors';

// .env access
dotenv.config();

// app configuration
const app = express();

// server configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser());


// read file and folder paths
const __dirname = path.resolve();

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/lib', express.static(__dirname + 'public/lib'))

// ejs template
app.set('view engine', 'ejs')

// Router - api
app.use('/', MainRouter);

// Error middlewares
// app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 6001;

// listen port
app.listen(PORT, () => {
    console.log(`server is running...!`);
})