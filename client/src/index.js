import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  './styles/global.css';
import UserStore from './store/UserStore';
import LanguageStore from "./store/LanguageStore";
import ShelterStore from "./store/ShelterStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
      user: new UserStore(),
      selectedLanguage: new LanguageStore(),
      shelter: new ShelterStore(),
  }}>
       <App />
  </Context.Provider>
);

