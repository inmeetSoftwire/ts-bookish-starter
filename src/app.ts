import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import borrowedRoutes from './controllers/borrowedController'

import { Book } from './bookInterface'
import { getBooksFromDB, getUsersFromDB } from './seqModels';

const port = process.env['PORT'] || 3000;

const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
app.use('/borrowedby', borrowedRoutes)

// app.get('/bookList', (req, res) => {
//   executeStatement()
//   res.json(allBooks)
// })
app.get('/bookList', (req, res) => {
  getBooksFromDB().then(data => res.json(data))
})
app.get('/users', (req, res) => {
  getUsersFromDB().then(data => res.json(data))
})

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    "server": "CHOWCHOW",
    "authentication": {
      "type": "default",
      "options": {
        "userName": "InmKhu",
        "password": "Ripcuscus123"
      }
    },
    "options": {
      "port": 1433,
      "database": "bookish",
      "trustServerCertificate": true
    }
  }
  
var connection = new Connection(config)


connection.on('connect', function(err) {
  if(err) {
    console.log('Error: ', err)
  }
  executeStatement()
});


connection.connect();

let allBooks = []




function executeStatement() {
  const request = new Request("select * FROM Books", function(err) {
    if (err) {
      throw err;
    }
    
  });
  
  
  request.on('row', function(columns) {
    const thisBook = {} as Book; 
    columns.forEach(function(column) {
      
      if (column.value === null) {
        console.log('NULL');
      }
      else if (column.metadata.colName === 'title') {
        thisBook.title = column.value
      } else if (column.metadata.colName === 'author') {
        thisBook.author = column.value
      } else if (column.metadata.colName == 'isbn') {
        thisBook.isbn = column.value
      }
      else if (column.metadata.colName == 'numOwnedByLibrary') {
        thisBook.numOwnedByLibrary = column.value
      }
    })
    allBooks.push(thisBook)
  });

  
  connection.execSql(request)
}


