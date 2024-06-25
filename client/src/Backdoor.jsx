import { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';

const apiHostAddress = '192.168.1.75'; // RasPi
//const apiHostAddress = '192.168.1.66'; // PC
const apiHostPort = 5000;

export default function App() {
  return (
    <main>
        <p id="albert">Hello World!</p>
    </main>
  );
}