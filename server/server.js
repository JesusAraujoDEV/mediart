require('dotenv').config(); // Importar dotenv al inicio
const express = require('express');
const routerApi = require('./routes');
const {config} = require('./config/config');

const { logErrors, errorHandler, ormErrorHandler, boomErrorHandler} = require('./middlewares/error_handler');
const app = express();
const cors = require('cors');
const port = config.port || 3000;

// Sirve los archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads')); // Ahora tus fuentes serán accesibles en /uploads/fonts/nombre_del_archivo.ttf


const whitelist = ['http://localhost:3000', config.clientUrl];
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

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

//swaggerDocs(app, port);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})

