const express = require("express");
const cors = require("cors");
const data = require("./data.json");

const app = express();

const apiHostPort = 5000;

// Allows Cross-Origin-Resource-Sharing so that one host can pull a script from another host. 
// Usually JS doesn't like this, but we can make a request past its guard.
app.use(cors());

app.get("/getData", (req, res) => {
    let myData = data.data;
    
    if (Object.keys(req.query).length > 0) {
      if (req.query.key) {
        myData = keyedData(myData, req.query.key);
      }
      if (req.query.tag) {
        myData = taggedData(myData, req.query.tag);
      }
      if (req.query.searchMethod && req.query.searchValue) {
        myData = searchData(myData, req.query.searchMethod, req.query.searchValue);
      }
      if (req.query.sort) {
        myData = sortData(myData, req.query.sort);
      }
    }
    res.send(myData);
  });
  
  app.get("/getAllKeys", (req, res) => {
    const allKeys = Array.from(new Set(data.data.map((entry) => entry.key)));
    allKeys.sort();
    res.send(allKeys);
  });
  
  app.listen(apiHostPort, () => {
    console.log(`Server is listening on port ${apiHostPort.toString()}.`);
  });
  
  function sortData(data, method) {
    return data.sort((aa, bb) => {
      let a;
      let b;
      let isReversed = false;
  
      if (method == "title") {
        a = aa.title.toUpperCase();
        b = bb.title.toUpperCase();
      } else if (method == "authors") {
        a = aa.authors[0].toUpperCase();
        b = bb.authors[0].toUpperCase();
      } else {
        a = aa.id;
        b = bb.id;
        isReversed = true;
      }
    
      if (isReversed) {
        if (a > b) {
          return -1;
        } else if (a < b) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      }
  
    });
  }
  
  function searchData(data, method, value) {
    return data.filter((entry) => {
      if (method == "author") {
        return entry.authors.some((author) => {
          return author.toLowerCase().includes(value.toLowerCase());
        });
      } else if (method == "title") {
        return entry.title.toLowerCase().includes(value.toLowerCase());
      }
    });
  }
  
  function taggedData(data, tag) {
    return data.filter((entry) => {
      return entry.tags.includes(tag.toLowerCase());
    });
  }
  
  function keyedData(data, tag) {
    if (tag.toLowerCase() == 'all') {
      return data;
    } 
  
    return data.filter((entry) => {
      return entry.key.toLowerCase() == tag.toLowerCase();
    });
  }