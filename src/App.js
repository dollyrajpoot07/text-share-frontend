import './App.css';
import Firstpage from './dialogBox/firstpage';
// import { SampleComponent } from './SampleClassComponent'

const Header = () => (
  <div className="Header">
    <h1 className="logo">
      Text Share
    </h1>
    <img src="./logo.png" className="image"></img>
  </div>
);

function App() {
  return (
    <div className="App">
      <Header />
      <Firstpage />
      {/* <SampleComponent /> */}
    </div>
  );
}

export default App;


