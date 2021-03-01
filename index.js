const express = require('express');
require('./database/mongoose');
const usersRoute = require('./routes/users');
const timeTableRoute = require('./routes/timetable');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3080;

app.use(express.static(path.join(__dirname, 'client/build')));

/*app.use(cors({
    credentials: true, 
    origin: 'http://app.yourlendar.fr'
}));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRoute);
app.use(timeTableRoute);

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => {
    console.log('Yourlendar API is listening on port ' + port);
});