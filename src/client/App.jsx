import { useEffect, useState } from "react";
import "./App.css";
import Collapsible from "react-collapsible";
import axios from 'axios';

export default function App() {
  const [data, setData] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [sort, setSort] = useState(null);
  const [searchMethod, setSearchMethod] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [tag, setTag] = useState(null);
  const [key, setKey] = useState(null);

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
      <form id="modifierForm" onSubmit={(event) => {
        event.preventDefault();
        setFetchTrigger(true);
      }}>
        <div id="modifierGrid">
          <span id="sortModifiers">
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
                  onChange={(e) => setSort(e.target.value)}
                />
                <label>{modifierLabel}</label>
              </div>);
            })}
          </span>
          <span id="searchModifiers">
            <label>Search by:</label><br/>
            <select name="searchMethod" onChange={(e) => setSearchMethod(e.target.value)}>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select><br/>
            <label>Search for:</label><br/>
            <input className="modifierInput" name="searchValue" type="text" onChange={(e) => setSearchValue(e.target.value)}></input>
          </span>
          <div>
          <span id="tagModifiers">
            <label>Tag:</label><br/>
            <input className="modifierInput" name="tag" type="text" onChange={(e) => setTag(e.target.value)}></input>
          </span>
          <span id="keyModifiers">
            <label>Key:</label><br/>
            <select name="key" onChange={(e) => setKey(e.target.value)}>
              {['Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db'].map((k) => {
                return (<option key='k'>{k}</option>);
              })}
            </select>
          </span>
          </div>
        </div>
        <input type="submit" id="modifierSubmit"/>
      </form>
      {data.map((entry) => {
        return <Tune key={entry.id} entry={entry}></Tune>
      })}
    </main>
  );
  
  async function fetchData() {
    await makeRequest().then((result) => {
      setData(result);
      setFetchTrigger(false);
    });
  }

  async function makeRequest() {
    let params = {
      sort: sort,
      tag: tag,
      key: key
    };
    if (searchMethod && searchValue) {
      params.searchMethod = searchMethod;
      params.searchValue = searchValue;
    } else {
      params.searchMethod = null;
      params.searchValue = null;
    }
  
    const res = await axios.get('http://localhost:3000/getData', {params: params});
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
      <div><b>Key:</b> {entry.key}</div>
    </Collapsible>
  );
}