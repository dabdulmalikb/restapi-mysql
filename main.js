var http = require('http');
var express = require('express');

var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');

//start mySql connection 
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company'
});

connection.connect(function(err){
    if(err) throw err
    console.log('You are connected...');
})

//end mySql connection

//start body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); 
//end body-parser

//create app server
var server = app.listen(3000, '127.0.0.1', function(){
    var host = server.address().address
    var port = server.address().port 

    console.log("This app listening at http://%s:%s", host, port);
});

//rest api to get all results

app.get('/employees', function(req, res){
    connection.query('SELECT * FROM employees', function(error, results, fields){
        if(error) throw error; 
        res.end(JSON.stringify(results));
    });
});

//GET employee with ID
app.get('/employees/:id', function(req, res){
    console.log(req);
    connection.query('SELECT * FROM employees WHERE id=?', [req.params.id], function(error, results, fields){
        if(error) throw error;
        res.end(JSON.stringify(results));
    });
});

//POST operation INSERT 

app.post('/employees', function(req, res){
    var postData = req.body;    
    postData.map(row => {
        connection.query('INSERT INTO employees SET ?', row, function(error, results, fields){
            if(error) throw error; 
            res.end(JSON.stringify(results));
        });
    });
    //console.log(postData);
    
});

//PUT - Update records
app.put('/employees', function(req, res){
    connection.query('UPDATE employees SET name=?, address=?, email=?, phone=? WHERE id=?', [req.body.name, req.body.address, req.body.email, req.body.phone, req.body.id], function(error, results, field){
        if(error) throw error;
        res.end(JSON.stringify(results));
    });
});

//DELETE - Delete records
app.delete('/employees', function(req, res){
    var postData = req.body;

    postData.map(row => {
        connection.query('DELETE FROM employees WHERE id = ?', [row.id], function(error, results, field){
            if(error) throw error;
            res.end(JSON.stringify(results));
        });
    });
   
});