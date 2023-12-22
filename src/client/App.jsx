import { useEffect, useState } from "react";
import "./App.css";
import Collapsible from "react-collapsible";

// FOR ACCESSING API:
// radio buttons (id, title, author) for sort
// input field for search
// either input field or more complicated dropdown for tags

export default function App() {
  const [dataFetchUrl, setDataFetchUrl] = useState('http://localhost:3000/getData');
  const [data, setData] = useState(null);
  const [sort, setSort] = useState(null);
  const [searchMethod, setSearchData] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [tag, setTag] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  /*if (sort) {
    setDataFetchUrl(`${dataFetchUrl}sort=${sort}&`);
    console.log(dataFetchUrl);
  }
  if (searchMethod && searchValue) {
    setDataFetchUrl(`${dataFetchUrl}searchMethod=${searchMethod}&searchValue=${searchValue}&`);
  }
  if (tag) {
    setDataFetchUrl(`${dataFetchUrl}tag=${tag}&`);
  }*/

  // Runs on page load
  useEffect(() => {
    fetchData();
  }, []);

  // Runs when fetchTrigger is changed
  useEffect(() => {
    console.log(dataFetchUrl);
    if (fetchTrigger) {
      fetchData();
    }

  }, [fetchTrigger]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {/*<AdditionForm></AdditionForm>*/}
      <form onSubmit={(event) => {
        event.preventDefault();
        setFetchTrigger(true);
      }}>
        <p>Sort:</p>
        <label>Alphabetical</label>
        <input name="sort" type="radio" value={'alpha'} onChange={(e) => setDataFetchUrl(`${dataFetchUrl}sort=${e.target.value}&`)}/>
        <label>Title</label>
        <input name="sort" type="radio" value={'title'} onChange={(e) => setDataFetchUrl(`${dataFetchUrl}sort=${e.target.value}&`)}/>
        <label>Author</label>
        <input name="sort" type="radio" value={'author'} onChange={(e) => setDataFetchUrl(`${dataFetchUrl}sort=${e.target.value}&`)}/>
        <input type="submit"/>
      </form>
      {data.map((entry) => {
        return <Tune key={entry.id} entry={entry}></Tune>
      })}
    </main>
  );
  
  async function fetchData() {
    const res = await fetch(dataFetchUrl);
    const result = await res.json();
    setData(result);
    setDataFetchUrl('http://localhost:3000/getData?');
    setFetchTrigger(false);   
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

/*function AdditionForm({}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkTxt, setLinkTxt] = useState("");
  const [tag, setTag] = useState("");

  return (
  <Collapsible trigger="Quick Add" transitionTime={200} className="songAddition" openedClassName="songAddition">
    <form className="additionForm" onSubmit={(event) => {
      event.preventDefault();
      addSong(title, author, linkTxt, linkHref, tag);
      window.location.reload();
    }}>
      <label>Title: </label>
      <input value={title} onChange={(e) => setTitle(e.target.value)}/>
      <label>Author: </label>
      <input value={author} onChange={(e) => setAuthor(e.target.value)}/>
      <label>Link text: </label>
      <input value={linkTxt} onChange={(e) => setLinkTxt(e.target.value)}/>
      <label>Link href: </label>
      <input value={linkHref} onChange={(e) => setLinkHref(e.target.value)}/>
      <label>Tag: </label>
      <input value={tag} onChange={(e) => setTag(e.target.value)}/><br/>
      <input type="submit"/>
    </form>
  </Collapsible>
  );
}
  
function addSong(title, author, linkTxt, linkHref, tag) {

  songData = {
    "title": title,
    "author": author,
    "links": [{
        "href": linkHref,
        "name": linkTxt
    }],
    "tags": [tag]
}

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: songData//JSON.stringify(songData)
  };

  fetch('http://localhost:3000/addSong', requestOptions).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error. Status: ${res.status}`);
    }
    alert("Song added!");
  });
}*/