import { useEffect, useState } from "react";
import "./App.css";
import Collapsible from "react-collapsible";
import axios from 'axios';

// either input field or more complicated dropdown for tags

export default function App() {
//  const [dataFetchUrl, setDataFetchUrl] = useState('http://localhost:3000/getData');
  const [data, setData] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const dfq = new DataFetchReq('http://localhost:3000/getData', null, null, null, null);

  // Runs on page load
  useEffect(() => {
    fetchData();
  }, []);

  // Runs when fetchTrigger is changed
  useEffect(() => {
    if (fetchTrigger) {
      fetchData();
    }
  }, [fetchTrigger]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <form className="modifierForm" onSubmit={(event) => {
        event.preventDefault();
        setFetchTrigger(true);
      }}>
        <div className="modifiers">
        <SortModifier dfq={dfq}/>
        <SearchModifier dfq={dfq}/>
        <TagModifier dfq={dfq}/>
        </div>
        <input type="submit" className="modifierSubmit"/>
      </form>
      {data.map((entry) => {
        return <Tune key={entry.id} entry={entry}></Tune>
      })}
    </main>
  );
  
  async function fetchData() {
    await dfq.makeRequest().then((result) => {
      setData(result);
      setFetchTrigger(false);
    });
  }
}

class DataFetchReq {
  constructor(baseUrl, initialSort, initialSearchMethod, initialSearchValue, initialTag) {
    this.baseUrl = baseUrl;
    this.sort = initialSort;
    this.searchMethod = initialSearchMethod;
    this.searchValue = initialSearchValue;
    this.tag = initialTag;
  }

  async makeRequest() {
    let params = {
      sort: this.sort,
      tag: this.tag
    };
    if (this.searchMethod && this.searchValue) {
      params.searchMethod = this.searchMethod;
      params.searchValue = this.searchValue;
    } else {
      params.searchMethod = null;
      params.searchValue = null;
    }

    console.log(params);

    const res = await axios.get(this.baseUrl, params);
    return res.data;
  }
}

function Tune({entry}) {
  return (
    <Collapsible className="tuneContainer" trigger={<h2 className="songTitle">{entry.title}</h2>} transitionTime={150} openedClassName="tuneContainer">
      <h4 className="author">{entry.author}</h4>
      <div className="listContainer"><b>Links:</b>
        {entry.links.map((link, i) => {
          if (link.name) {
            return <a key={i} href={link.href}>{link.name}{(entry.links.length - 1 !== i) && ", "}</a>
          } else {
            return <a key={i} href={link.href}>{link.href}{(entry.links.length - 1 !== i) && ", "}</a>
          }
        })}
      </div>
      <span className="listContainer"><b>Tags:</b>
        {entry.tags.map((tag, i) => {
          return <span key={i}>{tag}{(entry.tags.length - 1 !== i) && ", "}</span>
        })}
      </span>
    </Collapsible>
  );
}

function SortModifier({dfq}) {
  return (
    <span className="sortModifiers">
      Sort by:
      {[['id', 'Date Added'], ['title', 'Title'], ['author', 'Author']].map((modifierArr, i) => {
        const modifier = modifierArr[0];
        const modifierLabel = modifierArr[1];

        let isDefault = false;
        if (i == 0) {
          isDefault = true;
        }
        return (<div key={i}>
          <input name="sort" type="radio"
            value={modifier.toLowerCase()}
            defaultChecked={isDefault}
            onChange={(e) => {
              dfq.sort = e.target.value;
            }}
          />
          <label>{modifierLabel}</label>
        </div>);
      })}
    </span>
  );
}

function SearchModifier({dfq}) {
  /*const [searchMethod, setSearchMethod] = useState(null);
  const [searchValue, setSearchValue] = useState(null);

  useEffect(() => {
    dfq.searchMethod = searchMethod;
    dfq.searchValue = searchValue;
  }, [searchMethod, searchValue]);*/

  return (
    <span className="searchModifiers">
      <label>Search by:</label><br/>
      <select name="searchMethod" onChange={(e) => dfq.searchMethod = e.target.value}>
        <option value="title">Title</option>
        <option value="author">Author</option>
      </select><br/>
      <label>Search for:</label><br/>
      <input name="searchValue" type="text" onChange={(e) => dfq.searchValue = e.target.value}></input>
    </span>
  );
}

function TagModifier({dfq}) {
  return <div>Hi</div>
}