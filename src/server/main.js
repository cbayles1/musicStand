import express from "express";
import ViteExpress from "vite-express";
import data from "./data.json" assert { type: "json" };

const app = express();

app.get("/getData", (req, res) => {
  let myData = data.data;
  
  if (Object.keys(req.query).length > 0) {
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

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);

function sortData(data, method) {
  return data.sort((aa, bb) => {
    let a;
    let b;

    if (method == "alpha" || method == "title") {
      a = aa.title.toUpperCase();
      b = bb.title.toUpperCase();
    } else if (method == "author") {
      a = aa.author.toUpperCase();
      b = bb.author.toUpperCase();
    }
  
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }

  });
}

function searchData(data, method, value) {
  return data.filter((entry) => {
    if (method == "author") {
      return entry.author.toLowerCase().startsWith(value.toLowerCase());
    } else if (method == "title") {
      return entry.title.toLowerCase().startsWith(value.toLowerCase());
    }
  });
}

function taggedData(data, tag) {
  return data.filter((entry) => {
    return entry.tags.includes(tag.toLowerCase());
  });
}