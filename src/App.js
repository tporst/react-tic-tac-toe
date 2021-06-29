import './App.css';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import TicTacToe from './tic-tac-toe/TicTacToe.js';
// functional component alternativ you can use the class component 
function App() {
  return (
    <div className="App">
       <div className="header">Tic Tac Minecraft</div>       
       <div className="">
         <TicTacToe />
       </div>     
    </div>
  );
}

export default App;
