require('dotenv').config();
const express = require('express');
const routerApi = require('./routes');
const { config } = require('./config/config');

const { logErrors, errorHandler, ormErrorHandler, boomErrorHandler } = require('./middlewares/error_handler');
const path = require('path');
const app = express();
const cors = require('cors');
const port = config.port || 3000;

const setupSwagger = require('./swagger');

// HOLA MUNDO

// Sirve los archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const whitelist = ['http://localhost:3000', config.clientUrl, config.backendUrl];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin){
      callback(null, true);
    } else{
      callback(new Error('No permitido por CORS'));
    }
  }
}
app.use(cors(options));
require('./utils/auth');

app.use(express.json());

app.get('/api', (req, res) => {
  res.send('HOLA MUNDO????')
});

app.get('/', (req, res) => {
  res.send('HOLA MUNDO, pero sin api?????')
});

routerApi(app);

setupSwagger(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})