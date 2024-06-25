import { useState } from "react";
import "./App.css";
import axios from 'axios';

//const apiHostAddress = '192.168.1.75'; // RasPi
const apiHostAddress = 'localhost'; // PC
const apiHostPort = 5000;

export default function App() {
  return (
    <main>
      <AddSongForm></AddSongForm>
    </main>
  );
}

function AddSongForm() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([]);
  const [key, setKey] = useState("N/A");

  return (<div className="backdoorForm">
    <h2 className="backdoorHeader">Add Song</h2>
    <SoloTextInput name="title" label="Title" onChangeFunc={setTitle}/>
    <InputArr arrLabel="Authors" arrHook={authors} setArrHook={setAuthors}/>
    <SoloTextInput name="key" label="Key" onChangeFunc={setKey}/>
    <br/>
    <button className="addItemButton" onClick={(e) => {
      addSong(title, authors, key);
    }}>Submit</button>
  </div>);
}

function RemoveSongForm() {

}

function InputArr({arrLabel, arrHook, setArrHook}) {
  const [next, setNext] = useState("");
  let arrUl = <></>;
  if (arrHook.length > 0) {
    arrUl = (<ul className="arrItemsList">
      {arrHook.map(element => (
        <li className="arrItem" key={element}>
          {element}{' '}
          <button className="deleteItemButton" onClick={() => {
            setArrHook(arrHook.filter(a => a != element));
          }}>X</button>
        </li>
      ))}
    </ul>);
  }

  return (
    <div className="inputArr">
      <label className="inputArrLabel">{arrLabel}: </label>
      <span>
        <input value={next} onChange={e => setNext(e.target.value)} />
        <button className="addItemButton" onClick={() => {
          if (next.length > 0 && !arrHook.includes(next)) {
            console.log("Adding author...");
            setArrHook([...arrHook, next]);
          }
        }}>Add</button>
      </span>
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

async function addSong(title, authors, key) {
  console.log("Adding song...");
  const res = await axios.post(`http://${apiHostAddress}:${apiHostPort.toString()}/addSong`, 
  {title: title, authors: authors, key: key}, 
  {headers: {"Content-Type": "application/json"}});
}