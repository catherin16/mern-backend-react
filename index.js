const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors')
require('dotenv').config();

const app = express();

dbConnection();
//Directorio publico

// CORS
app.use(cors())

app.use(express.static('public'));

// lectura y parseo del body

app.use(express.json());

// rutas

app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));

app.listen(process.env.PORT,()=>{
    console.log(`corriendo en puerto ${process.env.PORT}`);
})