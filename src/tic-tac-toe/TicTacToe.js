import React from 'react';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import './TicTacToe.css';
import { Button, Row, Col } from 'react-materialize';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import background from "./background.png";
import arrow from "./arrow.png";

//component representing a single brick on the toc tac toe borad
class Brick extends React.Component {

  constructor(props) {
    super(props);
    this.onTic = this.onTic.bind(this); // always when you use a method as event handler callback you have to bind it, otherweise the this is lost  
  }    
  // this onClick handler is liftig up the state to the main component
  onTic(e){
    // tic only if the value is not set yet  
    if(!this.props.value && !this.props.blocked){
  
      this.props.onTic(this.props.x, this.props.y, e);
    }
  } 

  render(){
    let hero = this.props.value ? this.props.heros.get(this.props.value) : '';
    return(
      <div className="brick">        
        <div        
            className="hero"
            onClick={(e)=>this.onTic(e)}
        >       
          {hero}          
        </div>
      </div>
    )
  }
}



//class componennt
class TicTacToe extends React.Component {

  constructor(props) {
    super(props);
    let heroIndex= Math.floor(Math.random() * 3);
    let allHerosX=['h1.png','h2.png','h3.png'];
    let allHerosY=['h4.png','h5.png','h6.png'];
    
    this.state = {
      owins: 0, //score counter
      xwins:0,
      blocked:false, //bloking the click event if oponen is doing a move
      heros:  new Map([
        ['x', <img  src={allHerosX[heroIndex]} alt="" className="hero" />],
        ['o', <img  src={allHerosY[heroIndex]}  alt="" className="hero" />]
        
      ]),
      activeFigure: 'o',
      matrix:[[],
              [],
              []],
      gameOver:false
    };

    this.handleTic = this.handleTic.bind(this);//js has no binding for class methods, so we have to do it otherweise the this context is lost when we call the method as callback in listner
    this.reset = this.reset.bind(this);
    this.getInventoryRow = this.getInventoryRow.bind(this);
    this.autoTic =  this.autoTic.bind(this);
  }

reset(){
    for(let x =0; x<=2; x++){
      document.querySelectorAll('#row'+x).forEach(elem => 
        {
          elem.querySelector('div').querySelector('div').className = elem.querySelector('div').querySelector('div').className.replaceAll(" winner", "")
        }); 
      document.querySelectorAll('#column'+x).forEach(elem => elem.querySelector('div').querySelector('div').className = elem.querySelector('div').querySelector('div').className.replaceAll(" winner", "")); 
    }
    
    this.setState({
      activeFigure: 'o',
      matrix:[[],
              [],
              []],
      gameOver:false
    });

  }

//asynchron move, done by auto player
async autoTic(){ 
    
  
    // perform auto move after some time
    setTimeout(()=>{
     
      //calculate best position
      let [x,y] = this.calculateBestMove();
      //perform auto move
      this.handleTic(x,y,false);
      //unblock the oposite player
      this.setState((state, props)=>{
          return {blocked: !state.blocked}
        });
      
    }, 600);

    return 'autoTic';
}

//deep colone of move matrix
matrixClone(){ 
  let copyMatrixRows=[];
  this.state.matrix.forEach((row, rowIndex)=>{
    copyMatrixRows[rowIndex]=[...row];
  });

  return copyMatrixRows;
}
//filter all dirtty values from state like 'undefined' etc. 
//these values are automaticly created by js when we inserting into empty array in other than 1 position
movesDone(row){
  return  row.filter(e=>e ==='o' || e ==='x').length;
}

//check if all possible moves are done
gameOver(matrix){
  const reducer = (length, row) => {return length + row.filter(e => {return e ==='o' || e ==='x'}).length; };
  let reduced = matrix.reduce(reducer,0);
  return reduced === 9;
}



calculateBestMove(){
  //next move ranking map
  //always take 100 when not availabe then -100 else 0
   let moves=  new Map([
    [100, []],
    [0, []],
    [-100, []] 
    
  ]);
  // clone matrix for row evaluation
  let copyMatrixRows= this.matrixClone();
  //calculate next move ranking for all possible moves placed in rows
  copyMatrixRows.forEach((row, rowIndex)=>{
    
    for(let i=0; i<=2; i++){
        
      if(this.movesDone(row)===2){
      //2 moves done, the next move can decide about win
        if(row[i] !== 'x' && row[i] !== 'o'){
            //check if possible to win for auto player
            row[i]=this.state.activeFigure;        
            if(this.evaluateTicRow(row, this.state.activeFigure)){    
              //move to win
              moves.set(100, [i,rowIndex] );
            }
            // check if possible to win for oponent
            let nextFigure = (this.state.activeFigure === 'x' ? 'o' : 'x');
            row[i]=nextFigure;
              
            if(this.evaluateTicRow(row, nextFigure)){
              //block opponent winning move
              moves.set(-100, [i,rowIndex] );
              console.log('step2: i should block');           
            }            

            //no deciding move can be done
            if(moves.get(-100).length === 0 && moves.get(-100).length === 0 ){
              moves.set(0, [i,rowIndex] ); 
            }

          }     
      }
      //only 1 or no moves done in the row, the next move doesnt metter 
      //but we can improve the algorithm, to check hier the over next move
     // if((moves.get(100).length<1 && moves.get(-100).length<1)){
      else if(row[i] !== 'x' && row[i] !== 'o'){
          moves.set(0, [i,rowIndex] );
      }        
    }  
  });

  // clone matrix for column evaluation
  let copyMatrixColumns=this.matrixClone();
  //calculate next move ranking for all possible moves placed in columns
  for(let rowIndex=0; rowIndex<=2; rowIndex++){
    let column=[];
    //extract column as array
    copyMatrixColumns.forEach(row =>{
      column.push(row[rowIndex]);
    });

    if(this.movesDone(column)===2){
      
      for(let i=0; i<=2; i++){
        if(column[i] !== 'x' && column[i] !== 'o'){       
          //check if possible to win for auto player        
          column[i]=this.state.activeFigure;
          if(this.evaluateTicRow(column, this.state.activeFigure)){    
            //move to win
            moves.set(100,  [rowIndex,i] );
          }
         
          // check if possible to win for oponent
          let nextFigure = (this.state.activeFigure === 'x' ? 'o' : 'x');
          column[i]=nextFigure;            
          if(this.evaluateTicRow(column, nextFigure)){
          //move to block opponent
            moves.set(-100, [rowIndex,i] );
          }
        }   
      }
    }
  }



    // clone matrix for DiagonalDown0 evaluation
    let copyMatrixDiagonalDown=this.matrixClone();
    //calculate next move ranking for all possible moves placed in columns
   // for(let rowIndex=0; rowIndex<=2; rowIndex++){
      let column=[];
      //extract column as array
      let j=0;
      copyMatrixDiagonalDown.forEach(row =>{

        column.push(row[j]);
        j++;
      });
  
      if(this.movesDone(column)===2){
        
        for(let i=0; i<=2; i++){
          if(column[i] !== 'x' && column[i] !== 'o'){       
            //check if possible to win for auto player        
            column[i]=this.state.activeFigure;
            if(this.evaluateTicRow(column, this.state.activeFigure)){    
              //move to win
              moves.set(100,  [i,i] );
            }
           
            // check if possible to win for oponent
            let nextFigure = (this.state.activeFigure === 'x' ? 'o' : 'x');
            column[i]=nextFigure;            
            if(this.evaluateTicRow(column, nextFigure)){
            //move to block opponent
              moves.set(-100, [i,i] );
            }
          }   
        }
      }
    //}

    //clone matrix for DiagonalUp evaluation
    let copyMatrixDiagonalUp=this.matrixClone();
    let columnDiagonalUp=[];
    let jj=2;
    copyMatrixDiagonalUp.forEach(row =>{
      columnDiagonalUp.push(row[jj]);
      jj--;         
    });
     
    if(this.movesDone(columnDiagonalUp)===2){
           
      for(let i=0; i<=2; i++){
        if(columnDiagonalUp[i] !== 'x' && columnDiagonalUp[i] !== 'o'){       
          //check if possible to win for auto player        
          columnDiagonalUp[i]=this.state.activeFigure;
               if(this.evaluateTicRow(columnDiagonalUp, this.state.activeFigure)){    
                 //move to win
                 moves.set(100,  [2-i,i] );
               }
              
               // check if possible to win for oponent
               let nextFigure = (this.state.activeFigure === 'x' ? 'o' : 'x');
               columnDiagonalUp[i]=nextFigure;            
               if(this.evaluateTicRow(columnDiagonalUp, nextFigure)){
               //move to block opponent
                 moves.set(-100, [2-i,i] );
               }
             }   
           }
         }



 //after ranging all posible moves
 if(moves.get(100).length>0){
    //move to win 
    return moves.get(100);
  }else if(moves.get(-100).length>0){
    //when not possible to win than block opponent
    return moves.get(-100);
  }else{
    //else move randomly
    //this step can be improved
    return moves.get(0);
  }
}

  handleTic(x,y, clickEvent){


    if(!this.state.gameOver ){
        
        let winner = false;

        this.setState((prevState, props)=>{
        
          let nextFigure = (prevState.activeFigure === 'x' ? 'o' : 'x');
          //is this state manipulation ok
          prevState.matrix[y][x] = prevState.activeFigure;        
          

          // evaluate if the click was a winning click and show it in UI accordingly 
          if(this.evaluateTicRow(prevState.matrix[y], prevState.activeFigure)){

            document.querySelectorAll('#row'+y).forEach(elem =>  {
             
               elem.querySelector('div').querySelector('div').className +=' winner';          
          });

          winner = true;
          }

          if(this.evaluateTicColumn(prevState.matrix, x, prevState.activeFigure)){

            document.querySelectorAll('#column'+x).forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
            winner = true;
          }
          if(this.evaluateTicCornedDown(prevState.matrix, prevState.activeFigure)){

           
            document.querySelectorAll('.diagonalDown').forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
            
            winner = true;
          }

          if(this.evaluateTicCornedUp(prevState.matrix, prevState.activeFigure)){

           
            document.querySelectorAll('.diagonalUp').forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
         
            winner = true;
          }

          
         
          return{
            owins: (prevState.activeFigure === 'o' && winner) ? prevState.owins+1 : prevState.owins,
            xwins: (prevState.activeFigure === 'x' && winner) ? prevState.xwins+1 : prevState.xwins,
            blocked:true, //block the move and wait on auto move
            matrix : prevState.matrix,
            activeFigure : nextFigure,
            gameOver : this.gameOver(prevState.matrix) || winner
          }
        });

        //do auto move only after click event
        if(clickEvent) {                    
          this.autoTic();          
        }
      }      
  }  
  //all helper methods used to evaluate the done move 
  evaluateTicColumn(matrix, x, tic){
    let column = [];
    matrix.forEach(row=>{column.push(row[x]);});
    let evalTicTacColumn = column.filter(ticTack => ticTack === tic);
    
    return evalTicTacColumn.length === 3 ? true : false;
  } 

  evaluateTicRow(ticTacRow, tic){    
    let evalTicTacRow = ticTacRow.filter(ticTac => ticTac === tic);
    
    return evalTicTacRow.length === 3 ? true : false;      
  }

  evaluateTicCornedDown(matrix, tic){    
    let diagonal = [matrix[0][0],matrix[1][1],matrix[2][2]];
    let evalTicTacDiagonal= diagonal.filter(ticTac => ticTac === tic);
    
    return evalTicTacDiagonal.length === 3 ? true : false;         
  }

  evaluateTicCornedUp(matrix, tic){    
    let diagonal = [matrix[0][2],matrix[1][1],matrix[2][0]];
    let evalTicTacDiagonal= diagonal.filter(ticTac => ticTac === tic);
    
    return evalTicTacDiagonal.length === 3 ? true : false;         
  }

  getInventoryRow(column,cSize, figure){

    let row = Array.from(Array(column).keys());
    let hero = this.state.heros.get(figure);

 
    let inventory = row.map(r=>{
      
      return <Col className="" s={cSize}>   
                <div className="brick"><div  className="hero">                                                  
                  </div></div>
            </Col>;
    });
    inventory[0]=<Col className="" s={cSize}>   
                    <div className="brick"><div  className="hero">
                    {hero}
                    <div style={{ position: 'absolute',
        top: '0',
        right: '0',
        opacity: '0.8'}}> 
                        <NotificationBadge count={figure==='o'?this.state.owins:this.state.xwins} effect={Effect.SCALE} />
                    </div> 

                    </div></div>
                </Col>;
    return inventory;
}

  //the UI of the GAME
  render() {
    
    const cSize=0.1;
   
    return (
    
    <div className="container console" >
      
       

      <div className="panel ">
           
           
            <div className="flexcontainer" style={{width: '98%'}}>
                <div className="label flexitemleft">
                  Crafting
                </div>
                <div className="flexitemmid">
                </div>
                <div  style={{}}>        
                    <Button
                     
                      small
                      node="a"
      
                      waves="light"
                      onClick={this.reset}
                    >
                    RESTART GAME
                    </Button>                
                </div>
            </div>    
    
            <div className="flexcontainer">
              
              <div className="flexitemleft">
                      <Row >
                        <Col 
                        
                            className=""
                            s={cSize}
                          >
                            <div id='row0' className="diagonalDown">
                            <div id='column0' className="">
                              <Brick  x={0} y={0} value={this.state.matrix[0][0]} blocked={this.state.blocked} onTic={this.handleTic} heros={this.state.heros} />
                            </div> 
                            </div>  
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                              <div id='row0' className="">
                              <div id='column1' className="">
                                <Brick x={1} y={0} value={this.state.matrix[0][1]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>  
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row0' className="">
                            <div id='column2' className="diagonalUp">
                                <Brick x={2} y={0} value={this.state.matrix[0][2]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>    
                          </Col>
                      </Row>

                      <Row>

                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row1' className="">
                            <div id='column0' className="">
                              <Brick x={0} y={1} value={this.state.matrix[1][0]} blocked={this.state.blocked} onTic={this.handleTic}  heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row1' className="diagonalDown">
                            <div id='column1' className="diagonalUp">
                              <Brick x={1} y={1} value={this.state.matrix[1][1]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row1' className="">
                            <div id='column2' className="">
                              <Brick x={2} y={1} value={this.state.matrix[1][2]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                      </Row>              

                      <Row>
                          <Col
                            className=""
                            s={cSize}
                          >
                              
                              <div id='row2' className="">
                              <div id='column0' className="diagonalUp">
                                <Brick x={0} y={2} value={this.state.matrix[2][0]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row2' className="">
                            <div id='column1' className="">
                              <Brick x={1} y={2} value={this.state.matrix[2][1]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row2' className="diagonalDown">
                            <div id='column2' className="">
                                <Brick x={2} y={2} value={this.state.matrix[2][2]} blocked={this.state.blocked}  onTic={this.handleTic} heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                      </Row>
              </div>
              <div className="flexitemmid">
                <img src={arrow} alt="Paris"  width="90px"></img>
              </div>
              <div className="flexitemright"> 
                <Brick  value={this.state.activeFigure} onTic={this.handleTic} heros={this.state.heros}/>
              </div>
            </div>      



            <div className="label">
              Inventory
            </div>  
            <div className="flexitemleft">
              <div className="">
              
            {/*         <Row style={{width:'700px'}}>
                      {this.getInventoryRow(7, cSize, 'x')}
                    </Row> */}
                    <Row style={{width:'700px'}}>
                      {this.getInventoryRow(7, cSize, 'o')}
                    </Row>
                    <Row style={{width:'700px'}}>
                      {this.getInventoryRow(7, cSize, 'x')}
                    </Row>
              </div>
            </div>
      </div>
              
       






       
            </div>
      
      
      
      );
  }
}

export default TicTacToe;
