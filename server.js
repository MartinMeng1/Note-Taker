const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require("./helpers/fshelper");

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes',(req,res)=>{
    
})