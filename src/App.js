import logo from './logo.svg';
import './App.css';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import { Button, Card, Row, Col ,CollectionItem,Collection,Carousel,Parallax } from 'react-materialize';
import { Navbar,Tabs,Tab ,Icon,NavItem} from 'react-materialize';
import TicTacToe from './tic-tac-toe/TicTacToe.js';
// functional component alternativ you can use the class component 
function App() {
  
  const numbers = [1, 2, 3, 4, 5];
  const listItems = numbers.map((number) =>
  <li>{number}</li>
);
  
  return (


    <div className="App">
      <TicTacToe test='tomasz'/>
     
    </div>
  );
}

export default App;
