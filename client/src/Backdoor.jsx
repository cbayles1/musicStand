import { useState } from "react";
import "./App.css";
import axios from 'axios';

//const apiHostAddress = '192.168.1.75'; // RasPi
const apiHostAddress = 'localhost'; // PC
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

export function RemoveSongForm({popupRef}) {

}

export function EditSongForm({popupRef}) {

}

function InputArr({arrLabel, arrHook, setArrHook, containsObjects=false}) {

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
      <input value={name} placeholder="Link Name" onChange={e => setName(e.target.value)}/>
      {' '}
      <input value={href} placeholder="Link Href" onChange={e => setHref(e.target.value)}/>
      <button className="addItemButton" onClick={() => {
        if (name.length > 0 && href.length > 0 && !arrHook.includes({name, href})) {
          setArrHook([...arrHook, {name, href}]);
        }
      }}>Add</button>
    </span>);

  } else {
    entryRow = (<span>
      <input value={next} onChange={e => setNext(e.target.value)} />
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

function SoloTextInput({name, label, onChangeFunc}) {
  return (<>
    <label htmlFor={name}>{label}: </label>
    <input id={name} name={name} type="text" onChange={(e) => onChangeFunc(e.target.value)}></input>
  </>);
}

async function addSong(title, authors, links, tags, key) {
  const res = await axios.post(`http://${apiHostAddress}:${apiHostPort.toString()}/addSong`, 
  {title: title, authors: authors, links: links, tags: tags, key: key}, 
  {headers: {"Content-Type": "application/json"}});
}