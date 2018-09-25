import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
    <button 
        //className="square" 
        className = {props.name}
        onClick={props.onClick}
    >
        {props.value}
    </button>
    );
}

const calculateWinner = (square)=>{
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
        if (square[a] && square[a] === square[b] && square[a] === square[c]) {
            //return square[a];
            return lines[i];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i, win) {
        return <Square 
            value = {this.props.square[i]}
            name = {win}
            onClick = {()=>this.props.onClick(i)}
            />;
    }

    renderBoard(){
        let col = [];
        for(let i = 0; i < 3; i++){
            let row = [];
            for(let j = 0; j < 3; j++){
                let win;
                if(this.props.win){
                    win = this.props.win;
                    if(i*3+j === win[0] || i*3+j === win[1] || i*3+j === win[2]){
                        row.push(this.renderSquare(i*3+j,'square-win'));   
                        continue;                     
                    }
                }
                row.push(this.renderSquare(i*3+j,'square'));
            }
            col.push(<div className="board-row">{row}</div>);
        }
        return col;
    }

    render() {
        return (
            <div>
                {/* <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div> */}
                {this.renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                square: Array(9).fill(null),
                location: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            bold: -1,
            increase: true,
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const square = current.square.slice();

        if(calculateWinner(square) || square[i]){
            return;
        }
        square[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                square: square,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            bold: -1,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) == 0,
            bold: step,
        });
    }

    toggleClick(){
        this.setState({
            increase: !this.state.increase,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.square);
        let moves = history.map((step,move) => {
            const desc = move ?
             `Go to move #${move}: (${history[move].location%3},${parseInt(history[move].location/3)})`
             : 'Go to game start';
            return(
                <li key={move}>
                    <button  onClick={() =>this.jumpTo(move)}>{this.state.bold == move ? <b>{desc}</b> : desc}</button>
                </li>
            )
        })

        if(!this.state.increase){
            moves = moves.reverse();
        }

        let status;
        if (winner){
            status = `Winner: ${this.state.xIsNext? 'O':'X'}`;
        }
        else{
            if(this.state.stepNumber == 9)
                status = 'Draw!!!';
            else
                status = `Next player: ${this.state.xIsNext ? 'X' : '0'}`;
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board square={current.square} win={winner} onClick={(i) => this.handleClick (i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => this.toggleClick()}>{this.state.increase ? 'Increase' : 'Decrease'}</button>
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
