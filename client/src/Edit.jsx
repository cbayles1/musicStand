import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';

const apiHostAddress = '192.168.1.75'; // RasPi
//const apiHostAddress = 'localhost'; // PC
const apiHostPort = 5000;

export function AddSongForm({popupRef, setFetchTrigger}) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [key, setKey] = useState("N/A");

  return (<div className="backdoorForm">
    <h2 className="backdoorHeader">Add Song</h2>
    <SoloTextInput name="title" label="Title" onChangeFunc={setTitle}/>
    <InputArr arrLabel="Authors" arrHook={authors} setArrHook={setAuthors}/>
    <InputArr arrLabel="Links" arrHook={links} setArrHook={setLinks} containsObjects={true}/>
    <InputArr arrLabel="Tags" arrHook={tags} setArrHook={setTags}/>
    <SoloTextInput name="key" label="Key" onChangeFunc={setKey}/>
    <br/>
    <button className="submitButton" onClick={async (e) => {
      await addSong(title, authors, links, tags, key);
      popupRef.current.close();
      setFetchTrigger(true);
    }}>Submit</button>
  </div>);
}

export function RemoveSongForm({popupRef, setFetchTrigger}) {
  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");

  return (<div className="backdoorForm">
    <h2 className="backdoorHeader">Remove Song</h2>
    <div id="removeSongForm">
      <SoloTextInput name="id" label="Id" onChangeFunc={setId}/>
      OR
      <SoloTextInput name="title" label="Title" onChangeFunc={setTitle}/>
    </div>
    <br/>
    <button className="submitButton" onClick={async (e) => {
      await removeSong(id, title);
      popupRef.current.close();
      setFetchTrigger(true);
    }}>Submit</button>
  </div>);
}

export function EditSongForm({popupRef, setFetchTrigger}) {
  const [id, setId] = useState(-1);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [key, setKey] = useState("N/A");
  const [isValidSong, setValidSong] = useState(false);

  return (<div className="backdoorForm">
    <h2 className="backdoorHeader">Edit Song</h2>
    <div id="editSongGetSongRow">
      <SoloTextInput name="id" label="Id" onChangeFunc={setId}/>
      <SoloTextInput value={title} name="title" label="Title" onChangeFunc={setTitle}/>
      <button className="addItemButton" onClick={async (e) => {
        const song = await getSong(id, title, authors, links, tags, key);
        setTitle(song.title);
        setAuthors(song.authors);
        setLinks(song.links);
        setTags(song.tags);
        setKey(song.key);
        setValidSong(true);
      }}>Get Song</button>
    </div>
    <InputArr arrLabel="Authors" arrHook={authors} setArrHook={setAuthors} disabled={!isValidSong}/>
    <InputArr arrLabel="Links" arrHook={links} setArrHook={setLinks} containsObjects={true} disabled={!isValidSong}/>
    <InputArr arrLabel="Tags" arrHook={tags} setArrHook={setTags} disabled={!isValidSong}/>
    <SoloTextInput value={key} name="key" label="Key" onChangeFunc={setKey} disabled={!isValidSong}/>
    <br/>
    <button className="submitButton" onClick={async (e) => {
      await editSong(id, title, authors, links, tags, key);
      popupRef.current.close();
      setFetchTrigger(true);
    }}>Make Changes</button>
  </div>);
}

function InputArr({arrLabel, arrHook, setArrHook, containsObjects=false, disabled=false}) {

  function RenderableElement({element}) {
    if (containsObjects) {
      return <>{element.name}: {element.href} </>
    } else {
      return <>{element} </>;
    }
  }

  const [next, setNext] = useState(""); // used in array mode
  const [name, setName] = useState(""); // used in object mode
  const [href, setHref] = useState(""); // used in object mode

  let arrUl = <></>;
  if (arrHook.length > 0) {
    arrUl = (<ul className="arrItemsList">
      {arrHook.map((element, i) => (
        <li className="arrItem" key={i}>
          <RenderableElement element={element}></RenderableElement>
          <button className="deleteItemButton" onClick={() => {
            setArrHook(arrHook.filter(a => a != element));
          }}>X</button>
        </li>
      ))}
    </ul>);
  }

  let entryRow;

  if (containsObjects) {
    entryRow = (<span>
      <input value={name} placeholder="Link Name" onChange={e => setName(e.target.value)} disabled={disabled}/>
      {' '}
      <input value={href} placeholder="Link Href" onChange={e => setHref(e.target.value)} disabled={disabled}/>
      <button className="addItemButton" onClick={() => {
        if (name.length > 0 && href.length > 0 && !arrHook.includes({name, href})) {
          setArrHook([...arrHook, {name, href}]);
        }
      }}>Add</button>
    </span>);

  } else {
    entryRow = (<span>
      <input value={next} onChange={e => setNext(e.target.value)} disabled={disabled}/>
      <button className="addItemButton" onClick={() => {
        if (next.length > 0 && !arrHook.includes(next)) {
          setArrHook([...arrHook, next]);
        }
      }}>Add</button>
    </span>);
  }

  return (
    <div className="inputArr">
      <label className="inputArrLabel">{arrLabel}: </label>
      {entryRow}
      {arrUl}
    </div>
  );
}

function SoloTextInput({value, name, label, onChangeFunc, disabled=false}) {
  return (<div>
    <label htmlFor={name}>{label}: </label>
    <input value={value} id={name} name={name} type="text" onChange={(e) => onChangeFunc(e.target.value)} disabled={disabled}></input>
  </div>);
}

async function addSong(title, authors, links, tags, key) {
  const res = await axios.post(`http://${apiHostAddress}:${apiHostPort.toString()}/addSong`, 
  {title: title, authors: authors, links: links, tags: tags, key: key}, 
  {headers: {"Content-Type": "application/json"}});
}

async function removeSong(id, title) {
  const res = await axios.post(`http://${apiHostAddress}:${apiHostPort.toString()}/deleteSong`, 
  {id: id, title: title},
  {headers: {"Content-Type": "application/json"}});
}

async function getSong(id, title) {
  const res = await axios.get(`http://${apiHostAddress}:${apiHostPort.toString()}/getSong`, {
    headers: {"Content-Type": "application/json"},
    params: {id: id, title: title}
  });
  return res.data;
}

async function editSong(id, title, authors, links, tags, key) {
  try {
    const res = await axios.post(`http://${apiHostAddress}:${apiHostPort.toString()}/editSong`, 
    {id: id, title: title, authors: authors, links: links, tags: tags, key: key}, 
    {headers: {"Content-Type": "application/json"}});
  } catch (err) {
    console.log(err);
  }
}
