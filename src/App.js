// src/App.js

import React from 'react';
import Box from './Box';
import { faBolt, faLock, faFlask, faVial , faUserCircle, faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  return (
    <div className="App">
      <video className="background-video" autoPlay muted loop>
        <source src="choices.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header className="App-header">
        <div className="box-container">
          <Box name="Energy Consumption" icon={faBolt} link="http://127.0.0.1:5500/" />
          <Box name="Tokenization" icon={faLock} link="https://6671d3b1235f9b3218a5c35b--thriving-stardust-24ef62.netlify.app/" />
          <Box name="Profile Settings" icon={faUserCircle} link="http://localhost:3001/modify.html" />
          <Box name="Login Page" icon={faSignInAlt} link="http://localhost:3001/login.html" />
        </div>
      </header>
    </div>
  );
}

export default App;
