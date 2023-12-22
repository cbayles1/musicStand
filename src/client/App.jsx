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

  // Runs on page load
  useEffect(() => {
    fetchData();
    setDataFetchUrl('http://localhost:3000/getData?');
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
      <form className="modifierForm" onSubmit={(event) => {
        event.preventDefault();
        setFetchTrigger(true);
      }}>
        <SortModifier dataFetchUrl={dataFetchUrl} setDataFetchUrl={setDataFetchUrl}/>
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

function SortModifier({dataFetchUrl, setDataFetchUrl}) {
  return (<>
    <span className="sortModifiers">
      Sort by:
      {['Id', 'Title', 'Author'].map((modifier, i) => {
        let isDefault = false;
        if (i == 0) {
          isDefault = true;
        } 
        return (<div key={i}>
          <input name="sort" type="radio"
            value={modifier.toLowerCase()} 
            defaultChecked={isDefault}
            onChange={(e) => setDataFetchUrl(`${dataFetchUrl}sort=${e.target.value}&`)}
          />
          <label>{modifier}</label>
        </div>);
      })}
    </span>
  </>);
}
