import React, { Component } from 'react';
import './App.css'

//Square component
const Square = props => { 
	const { value, ...other } = props;
	return(
		<button className={'square ' +value} onClick={()=>other.onClick()}>{value}</button>
	); 
}

//Board component
const Board = props => { 
	const { cells, squares, ...other } 	= props,
		ArrRows = [0,1,2];
	let counter = 1; 

	//Renders React element ...
	return(
		<div className="board"> {
			ArrRows.map((row) =>
				<div key={row.toString()} className="board-row">
					{
						cells.slice(row * 3 , counter++ * 3).map((cellID) =>
							<Square key={cellID.toString()} value={squares[cellID]} onClick={()=>other.onClick(cellID)} />
						)
					} 
				</div>
			)
		}
		</div>
	);
}

//Status component
const Status = props => {
	const { squares, xIsNext } = props,
		winner = calculateWinner(squares),
		effect = winner?'bounce':''; 
	let status;  

	if(winner) {
		status = 'Winner is: '+ winner;
	}else{
		status = 'Next player is: '+ (xIsNext?'x':'o');
	}
	
	//Renders React element ...
	return(
		<div className="game-info__status">
			<div className={'status '+effect}>{status}</div>
  		</div>
	); 
}



//Moves component
const Moves = props => {
	const { history, stepNumber, ...other } = props;
	const moves = history.map((step,move)=>{
		const clickIndex 	= step.clickIndex; 
		const 	col 		= Math.floor(clickIndex % 3),
				row 		= Math.floor(clickIndex / 3),
				//col and row where the latest click happened
				clickPosition = '(row:'+row+', col:'+col+')';
		let desc = move ? 'Go to move #'+move+' '+clickPosition : 'Go to game start';
		//Bold the currently selected item in the move list
		const btn_highlight = (stepNumber===move)?'btn-primary':'btn-secondary';
		return(
			<li key={move}>
	          	<button className={"btn "+btn_highlight+" btn-block"} 
	            onClick={()=> other.onClick(move) }>{desc}</button>
	        </li>
		);
	});
	
	//Renders React element ...
	return(
		<div className="game-info__moves">
            <ol className="list-moves list-unstyled">
              {moves}
            </ol>
        </div>
	);
}



//Game component 
export default class Game extends Component {
	constructor(props){
		super(props);
		this.state = {
			history: [{ 
				squares:Array(9).fill(null),
				clickIndex:null  
			}],
			xIsNext: true,
      		stepNumber: 0
		};
		this.handleClick = this.handleClick.bind(this);
		this.jumpTo = this.jumpTo.bind(this);
	}
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(squares[i] || calculateWinner(squares)) {
			return;
		}
		squares[i] = this.state.xIsNext?'x':'o';
		this.setState({
			history		: history.concat([{ squares:squares, clickIndex:i }]),
      		stepNumber	: history.length,
			xIsNext		: !this.state.xIsNext
		});
	}
	jumpTo(step) {
	    this.setState({
	      stepNumber: step,
	      xIsNext: (step % 2) === 0
	    });
	}
	
	//Renders React element ...
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();

		return(
			<div className="game">
				<div className="game-board">
					<Board squares={squares} onClick={this.handleClick} cells={[0,1,2,3,4,5,6,7,8]} />
				</div>
				<div className="game-info">
					<Status squares={ squares } xIsNext={ this.state.xIsNext } />
					<Moves history={ this.state.history } stepNumber={ this.state.stepNumber } onClick={this.jumpTo} /> 
				</div>
			</div>
		);
	}
}

/**
 * calculate winning combination
**/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}