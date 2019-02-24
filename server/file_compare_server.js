const express = require('express');
const path = require('path');
var bodyParser=require('body-parser');
const router = require('./file_compare');
const git = require('./git_api');
const fileUpload = require('express-fileupload')
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(fileUpload())
app.use(cors())
app.use(bodyParser.urlencoded({
  extended : true
}))
//git();
router(app);
http.listen(port, () => console.log(`Listening on port ${port}`));