import Header from "./components/header/Header"
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Footer from "./components/footer/Footer"
import "./styles/App.css"

function App() {
  return (
    <div >
      <Header />
      <div className="mainContainer">
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
