import Hello from '@kennyhyun/create-react-component';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Hello />
        <a
          className="App-link"
          href="https://github.com/kennyhyun/create-react-component"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Github create-react-component
        </a>
      </header>
    </div>
  );
}

export default App;
