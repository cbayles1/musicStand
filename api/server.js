const express = require("express");
const cors = require("cors");
const data = require("./data.json");
const fs = require("fs");

const app = express();

const apiHostPort = 5000;

// Allows Cross-Origin-Resource-Sharing so that one host can pull a script from another host. 
// Usually JS doesn't like this, but we can make a request past its guard.
app.use(cors());

// Allows us to read the request body, as JSON
app.use(express.json());

app.get("/getData", (req, res) => {
  let myData = data;
  
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
  const allKeys = Array.from(new Set(data.map((entry) => entry.key)));
  allKeys.sort();
  res.send(allKeys);
});

app.get("/getSong", (req, res) => {
  let myData = data;
  try {
    const input = req.query;
    if (input.id != null && input.id >= 0) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].id == input.id) {
          res.send(myData[i]);
          return;
        }
      }
    } else if (input.title != null) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].title == input.title) {
          res.send(myData[i]);
          return;
        }
      }
    }
    res.status(400).send("Song could not be found.");
  } catch {
    res.status(500).send("Something went wrong removing that song.");
  }
});

app.post("/addSong", (req, res) => {
  let myData = data;
  try {
    const newSong = req.body;
    newSong.id = getNextId(myData);
    myData.push(newSong);
    writeToJSONFile(myData);
    res.status(201).send("Song added successfully.");
  } catch {
    res.status(500).send("Something went wrong adding that song.");
  }
});

app.post("/deleteSong", (req, res) => {
  let myData = data;
  try {
    const input = req.body;
    if (input.id != null && input.id >= 0) {
      myData = myData.filter(song => song.id != req.id); // replace with array w/out song
    } else if (input.title != null) {
      myData = myData.filter(song => song.title != req.title); // replace with array w/out song
    } else {
      res.status(400).send("Song could not be found.");
      return; // don't write to file and don't give 200 success msg
    }

    writeToJSONFile(myData);
    res.status(200).send("Song removed successfully.");

  } catch {
    res.status(500).send("Something went wrong removing that song.");
  }
});

app.post("/editSong", (req, res) => {
  let myData = data;
  try {
    const edits = req.body;
    let songIndex = -1;
    if (edits.id != null && edits.id >= 0) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].id == edits.id) {
          songIndex = i;
          break;
        }
      }
    } else if (edits.title != null) {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].title == edits.title) {
          songIndex = i;
          break;
        }
      }
    } else {
      res.status(400).send("Song could not be found.");
      return; // don't edit, don't write to file, and don't give 200 success msg
    }

    if (edits.title) {
      myData[songIndex].title = edits.title;
    }
    if (edits.authors) {
      myData[songIndex].authors = edits.authors;
    }
    if (edits.key) {
      myData[songIndex].key = edits.key;
    }
    if (edits.links) {
      myData[songIndex].links = edits.links;
    }
    if (edits.tags) {
      myData[songIndex].tags = edits.tags;
    }
    
    writeToJSONFile(myData);
    res.status(200).send("Song edited successfully.");

  } catch {
    res.status(500).send("Something went wrong editing that song.");
  }
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

function getNextId(data) {
  let newestSong = data[0];
  data.forEach((song) => {
    if (song.id > newestSong.id) {
      newestSong = song;
    }
  });
  return newestSong.id + 1;
}

function writeToJSONFile(myData) {
  fs.writeFile("./data.json", JSON.stringify(myData, null, 2), (err) => {
    if (err) {
      console.error("Failed to write updated data to file.");
    }
  });
}