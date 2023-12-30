import express from "express";
import ViteExpress from "vite-express";
import data from "./data.json" assert { type: "json" };

const app = express();

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

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

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