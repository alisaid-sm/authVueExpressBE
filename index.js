const express = require('express')
const app = express()
const { PORT } = require('./src/helper/env')
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./src/router/user');
const path = require('path');

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1', userRouter)
 
app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
})