import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from './Home';
import Backdoor from './Backdoor';

export default function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' index element={<Home/>}/>
          <Route path='/backdoor' index element={<Backdoor/>}/>
        </Routes>
      </BrowserRouter>
    </main>
  );
}