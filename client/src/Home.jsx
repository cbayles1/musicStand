import { useEffect, useState, useRef } from "react";
import "./App.css";
import Collapsible from "react-collapsible";
import axios from 'axios';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { AddSongForm, RemoveSongForm, EditSongForm } from "./Edit";

//const apiHostAddress = '192.168.1.75'; // RasPi
const apiHostAddress = '192.168.1.66'; // PC
const apiHostPort = 5000;

export default function Home() {
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [data, setData] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [sort, setSort] = useState('id');
  const [searchMethod, setSearchMethod] = useState('title');
  const [searchValue, setSearchValue] = useState(null);
  const [tag, setTag] = useState(null);
  const [key, setKey] = useState('All');
  const [showCollections, setShowCollections] = useState(false);
  const addSongPopup = useRef();
  const editSongPopup = useRef();
  const removeSongPopup = useRef();

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

  let collectionLinks = <></>;
  if (showCollections) {
    collectionLinks = (<div>
    <a className="collectionLink" href="https://hymnary.org/">Hymnary</a>
    <a className="collectionLink" href="https://www.vgleadsheets.com/">VGM Lead Sheets</a>
    <a className="collectionLink" href="https://drive.google.com/file/d/1J-J5N_hSskErYIkc3h2Mfv73qcixYKsM/view?usp=sharing">Real Book</a>
    <a className="collectionLink" href="https://drive.google.com/file/d/1txhsjoSMZDCQ96ihH_DZIQXaS--vvB_t/view?usp=sharing">Dixieland Book</a>
    <a className="collectionLink" href="https://drive.google.com/drive/mobile/folders/1PzX4kS9c4WzaFfottk5x6m7N-NRX508y">Worship Nights Folder</a>
    </div>);
  }

  return (
    <main>
      <div id="popupButtonsContainer">  
          <Popup ref={addSongPopup} trigger={<button className="topRowButton">Add Song</button>} modal position="center center">
            <AddSongForm popupRef={addSongPopup} setFetchTrigger={setFetchTrigger}/>
          </Popup>
          <Popup ref={editSongPopup} trigger={<button className="topRowButton">Edit Song</button>} modal position="center center">
            <EditSongForm popupRef={editSongPopup} setFetchTrigger={setFetchTrigger}/>
          </Popup>
          <Popup ref={removeSongPopup} trigger={<button className="topRowButton">Remove Song</button>} modal position="center center">
            <RemoveSongForm popupRef={removeSongPopup} setFetchTrigger={setFetchTrigger}/>
          </Popup>
          <button className="topRowButton" onClick={() => { // toggle showing collections
            if (showCollections) {
              setShowCollections(false);
            } else {
              setShowCollections(true);
            }
          }}>Collections</button>
          <button className="topRowButton" onClick={shuffleData}>Shuffle</button>
      </div>
      <div id="collectionsRowWrapper">
        {collectionLinks}
      </div>
      <form id="modifierForm" onSubmit={(event) => {
        event.preventDefault();
        setFetchTrigger(true);
      }}>
        <div id="modifierGrid">
          <span id="sortModifiers">
            Sort by:
            {[['id', 'Date Added'], ['title', 'Title'], ['authors', 'Authors']].map((modifierArr, i) => {
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
            <select className="modifierInput" name="searchMethod" onChange={(e) => setSearchMethod(e.target.value)}>
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
            <select className="modifierInput" name="key" onChange={(e) => setKey(e.target.value)}>
              {visibleKeys.map((k) => {
                return (<option key={k}>{k}</option>);
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

    const res = await axios.get(`http://${apiHostAddress}:${apiHostPort.toString()}/getAllKeys`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const visibleKeys = res.data;
    visibleKeys.unshift('All');
    setVisibleKeys(visibleKeys);
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
  
    const res = await axios.get(`http://${apiHostAddress}:${apiHostPort.toString()}/getData`, {
      headers: {
        "Content-Type": "application/json"
      },
      params: params
    });
    return res.data;
  }
  
  async function shuffleData() {
    const copiedData = [...data]; // deep copy
    copiedData.sort(() => Math.random() - 0.5);
    setData(copiedData);
  };
}

function Tune({entry}) {
  let authors = [];
  let links = [];
  let tags = [];

  if (entry.authors) authors = entry.authors;
  if (entry.links) links = entry.links;
  if (entry.tags) tags = entry.tags;

  return (
    <Collapsible className="tuneContainer" trigger={
      <div className="tuneTrigger">
        <div className="songTitle">{entry.title}</div>
        <div className="songId">ID: {entry.id}</div>
      </div>
    } transitionTime={150} openedClassName="tuneContainer">
      
      <span className="listContainer"><b>Authors:</b>
        {authors.map((author, i) => {
          return <span key={i}>{author}{(authors.length - 1 !== i) && ", "}</span>
        })}
      </span>

      <div className="listContainer"><b>Links:</b>
        {links.map((link, i) => {
          if (link.name) {
            return <a key={i} href={link.href}>{link.name}{(links.length - 1 !== i) && ", "}</a>
          } else {
            return <a key={i} href={link.href}>{link.href}{(links.length - 1 !== i) && ", "}</a>
          }
        })}
      </div>

      <span className="listContainer"><b>Tags:</b>
        {tags.map((tag, i) => {
          return <span key={i}>{tag}{(tags.length - 1 !== i) && ", "}</span>
        })}
      </span>

      <div><b>Key:</b> {entry.key}</div>
      
    </Collapsible>
  );
}