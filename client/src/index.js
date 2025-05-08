import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import  './styles/global.css';
import UserStore from './store/UserStore';
import LanguageStore from "./store/LanguageStore";
import ShelterStore from "./store/ShelterStore";
import EmployeesStore from "./store/EmployeesStore";
import FeederStore from "./store/FeederStore";
import PetsStore from "./store/PetsStore";
import FeederInfoStore from "./store/FeederInfoStore";
import i18n from './i18n';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
      user: new UserStore(),
      selectedLanguage: new LanguageStore(),
      shelter: new ShelterStore(),
      employees: new EmployeesStore(),
      feeder: new FeederStore(),
      pets: new PetsStore(),
      feederInfo: new FeederInfoStore()
  }}>
       <App />
  </Context.Provider>
);

