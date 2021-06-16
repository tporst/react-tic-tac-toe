import React from 'react';
import ReactDOM from 'react-dom';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import './TicTacToe.css';
import { Button, Card, Row, Col, img ,CollectionItem,Collection,Carousel,Parallax } from 'react-materialize';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import background from "./background.png";
import arrow from "./arrow.png";

//Brick x={this.props.x}, y={this.props.y} <Button onClick={this.onTic}/>
class Brick extends React.Component {

  constructor(props) {
    super(props);
    this.onTic = this.onTic.bind(this); // always when you use a method as event handler callback you have to bind it, otherweise the this is lost  
  }    
  onTic(x,y){
    // tic only if the value is not set yet
    if(!this.props.value){

      this.props.onTic(this.props.x, this.props.y);
    }
  } 

  render(){

    let hero = this.props.value ? this.props.heros.get(this.props.value) : '';



    return(
      <div className="brick">        
        <div        
            className="hero"
            onClick={this.onTic}
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
      owins: 0,
      xwins:0,
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

    
  }

  reset(){

    for(let x =0; x<=2; x++){
      document.querySelectorAll('#row'+x).forEach(elem => 
        {
          //elem.querySelector('div').querySelector('div').className +=' winner'
        
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

  incrementWin(){

  }

  handleTic(x,y){
    //<img  src="minecraft.png"  alt="" className="hero" />

    if(!this.state.gameOver){
        this.setState((state, props)=>{
        
          let nextFigure = (state.activeFigure === 'x' ? 'o' : 'x');
          //is this state manipulation ok
          state.matrix[y][x] = state.activeFigure;
          let over = false;

          if(this.evaluateTicRow(state.matrix[y], state.activeFigure)){
          
            document.querySelectorAll('#row'+y).forEach(elem =>  {
             
               elem.querySelector('div').querySelector('div').className +=' winner';
          
          
          
          
          
          });

            over = true;
          }

          if(this.evaluateTicColumn(state.matrix, x, state.activeFigure)){

            document.querySelectorAll('#column'+x).forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
            over = true;

            

          }
          if(this.evaluateTicCornedDown(state.matrix, state.activeFigure)){

           
            document.querySelectorAll('.diagonalDown').forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
            console.log('evaluateTicCornedDown');
            over = true;
          }

          if(this.evaluateTicCornedUp(state.matrix, state.activeFigure)){

           
            document.querySelectorAll('.diagonalUp').forEach(elem =>  elem.querySelector('div').querySelector('div').className +=' winner');
         
            over = true;
          }

        

          return{
            owins: (state.activeFigure === 'o' && over) ? state.owins+1 : state.owins,
            xwins: (state.activeFigure === 'x' && over) ? state.xwins+1 : state.xwins,
            matrix : state.matrix,
            activeFigure : nextFigure,
            gameOver : over
          }
        });
      }      
  }  

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
    console.log('figure  '+figure);
    console.log('hero  '+hero);
 
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

  render() {
    
    const cSize=0.1;
   
    return (
    
    <div className="container console" >
      
      <h1>Tic Tac Minecraft</h1>        

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
                              <Brick  x={0} y={0} value={this.state.matrix[0][0]} onTic={this.handleTic} heros={this.state.heros} />
                            </div> 
                            </div>  
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                              <div id='row0' className="">
                              <div id='column1' className="">
                                <Brick x={1} y={0} value={this.state.matrix[0][1]} onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>  
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row0' className="">
                            <div id='column2' className="diagonalUp">
                                <Brick x={2} y={0} value={this.state.matrix[0][2]} onTic={this.handleTic} heros={this.state.heros}/>
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
                              <Brick x={0} y={1} value={this.state.matrix[1][0]} onTic={this.handleTic}  heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row1' className="diagonalDown">
                            <div id='column1' className="diagonalUp">
                              <Brick x={1} y={1} value={this.state.matrix[1][1]} onTic={this.handleTic} heros={this.state.heros}/>
                            </div>
                            </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row1' className="">
                            <div id='column2' className="">
                              <Brick x={2} y={1} value={this.state.matrix[1][2]} onTic={this.handleTic} heros={this.state.heros}/>
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
                                <Brick x={0} y={2} value={this.state.matrix[2][0]} onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row2' className="">
                            <div id='column1' className="">
                              <Brick x={1} y={2} value={this.state.matrix[2][1]} onTic={this.handleTic} heros={this.state.heros}/>
                              </div>
                              </div>
                          </Col>
                          <Col
                            className=""
                            s={cSize}
                          >
                            <div id='row2' className="diagonalDown">
                            <div id='column2' className="">
                                <Brick x={2} y={2} value={this.state.matrix[2][2]} onTic={this.handleTic} heros={this.state.heros}/>
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
