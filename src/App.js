import './App.css';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import TicTacToe from './tic-tac-toe/TicTacToe.js';
// functional component alternativ you can use the class component 
function App() {
  return (
    <div className="App">
       <h1>Tic Tac Minecraft</h1>       
       <div className="">
         <TicTacToe />
       </div>     
    </div>
  );
}

export default App;
