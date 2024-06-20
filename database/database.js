// var database = 'WhatappRPLC'
// var collec = 'GroupWhat'
// var query = {"key":"RPM","query":"RPM"}
// var type = ''
// var inset = [{"intest":"intest"}]
// var newvalues = {"intest":"intest"}
require('dotenv').config();
var mysql = require("mysql2");

var sqlfind = (database, table, query) => {
  return new Promise(function (resolve, reject) {
    console.log("-------");
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      
      connection.connect((err) => {
        if (err) {
          console.log("Error connecting to Db = ", err);
          return;
        }
        console.log("Connection");
      });

      if (query == "" || query == undefined) {
        return;
      }
      console.log("find : " + query.query);
      let sql =
        "SELECT * FROM " +
        table +
        " WHERE " +
        query.key +
        " = '" +
        query.query +
        "' ";
        console.log("SQL_find : " + sql);
      connection.query(sql, function (error, rows, fields) {
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        // console.log(resultArray);
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("Find complete!!!");
        connection.end();
        return resolve(resultArray);
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

var sqlinsert = (database, table, insert) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();

      if (insert == "" || insert == undefined) {
        return;
      }
      // console.log("Insert : Start!");
      let sql = "INSERT INTO " + table + " SET ?";
      connection.query(sql, insert, function (error, rows, fields) {
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        // console.log(resultArray);
        console.log("Insert complete!!!");
        connection.end();
        return resolve({ status: "insertsuccess" });
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

var sqlupdate = (database, table, query, newvalues) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();
      if (query == "" || query == undefined) {
        return;
      }
      console.log("update : " + query.query);
      var texarr = [];
      for (let index = 0; index < newvalues.length; index++) {
        if (typeof newvalues[index].newvalues != "number") {
          //console.log("log1");
          texarr.push(
            newvalues[index].key +
              " = " +
              "'" +
              newvalues[index].newvalues +
              "'"
          );
        } else {
          //console.log("log2");
          texarr.push(
            newvalues[index].key + " = " + "" + newvalues[index].newvalues + ""
          );
        }
      }
      var newval = texarr.toString();
      let sql =
        "UPDATE " +
        table +
        " SET " +
        newval +
        " WHERE " +
        query.key +
        " = '" +
        query.query +
        "' ";
      console.log(sql);
      connection.query(sql, function (error, rows, fields) {
        // var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("update complete!!!");
        connection.end();
        return resolve({ status: "update success" });
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

var sqldelete = (database, table, deleteq) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();

      if (deleteq == "" || deleteq == undefined) {
        return;
      }

      let sql = `DELETE FROM ${table} WHERE ${deleteq.key} = '${deleteq.value}'`;
      console.log(sql)
      connection.query(sql, function (error, rows, fields) {
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("Deleted complete!!!");
        connection.end();
        return resolve({ status: "Delete success" });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

var sqlfindtwowhere = (database, table, query, querytwo) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();

      if (query == "" || query == undefined) {
        return;
      }
      console.log("find : " + query.query);
      let sql =
        "SELECT * FROM " +
        table +
        " WHERE " +
        query.key +
        ' = "' +
        query.query +
        '" ' +
        "AND " +
        querytwo.key +
        ' = "' +
        querytwo.query +
        '" ';

      console.log("SQL_find : " + sql);
      connection.query(sql, function (error, rows, fields) {
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("Find complete!!!");
        connection.end();
        return resolve(resultArray);
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

var reject = () => {
  return new Promise(function (resolve, reject) {
    return reject();
  });
};

var sqlall = (database, table) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();

      let sql =
        "SELECT * FROM " +
        table ;
  
      connection.query(sql, function (error, rows, fields) {
        var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("Find complete!!!");
        connection.end();
        return resolve(resultArray);
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

var sqlupdatetwo = (database, table, query, query2, newvalues) => {
  return new Promise(function (resolve, reject) {
    try {
      const connection = mysql.createConnection({
        connectionLimit: 100,
        host: process.env.MYSQL,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: database,
      });
      connection.connect();
      if (query == "" || query == undefined) {
        return;
      }
      // console.log("update : " + query.query);
      // console.log(database)
      // console.log(table)
      // console.log(query)
      // console.log(newvalues)

      var texarr = []
      for (let index = 0; index < newvalues.length; index++) {
        if(typeof newvalues[index].newvalues != 'number'){
          texarr.push(newvalues[index].key +' = '+ "'" + newvalues[index].newvalues + "'" )
        } else {
          texarr.push(newvalues[index].key +' = '+ "" + newvalues[index].newvalues + "" )
        }
      }
      var newval = texarr.toString()
      let sql =
      "UPDATE " +
      table +
      " SET " +
      newval+
      " WHERE " +
      query.key +
      " = '" +
      query.query +
      "' "+
      "AND " +
      query2.key +
      " = '" +
      query2.query +
      "' "
      ;
      console.log(sql)
      connection.query(sql, function (error, rows, fields) {
        // var resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
        if (error) {
          console.log(error);
          connection.end();
          return reject({ status: error });
        }
        // console.log(resultArray);
        console.log("update complete!!!");
        connection.end();
        return resolve({ status: "updatesuccess" });
      });
    } catch (err) {
      return reject({ status: err });
    }
  });
};

exports.sqlfind = sqlfind;
exports.sqlinsert = sqlinsert;
exports.sqlupdate = sqlupdate;
exports.reject = reject;
exports.sqldelete = sqldelete;
exports.sqlfindtwowhere = sqlfindtwowhere;
exports.sqlall = sqlall;
exports.sqlupdatetwo = sqlupdatetwo;

///////////////////////////////////Mongo-express/////////////////////////////////////////////
