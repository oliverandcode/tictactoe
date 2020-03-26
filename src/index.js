import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let boardColumn = 0;
        let board = Array(0);

        for (let j = 0; j < 3; j++) {
            let boardRow = Array(0);
            for (let i = boardColumn; i < boardColumn + 3; i++) {
                boardRow.push(this.renderSquare(i));
            }
            boardColumn += 3;
            board.push(<div className="board-row">{boardRow}</div>);
        };

        return (
            <div>{board}</div>
        );        
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            let stepSquareIndex;
            for (let i = 0; i < step.squares.length; i++) {
                if (step.squares[i] && !history[move -1].squares[i]) {
                    stepSquareIndex = i;
                }
            };

            let col;
            if (stepSquareIndex === 0 || stepSquareIndex === 3 || stepSquareIndex === 6) {
                col = 'A';
            } else if (stepSquareIndex === 1 || stepSquareIndex === 4 || stepSquareIndex === 7) {
                col = 'B';
            } else if (stepSquareIndex === 2 || stepSquareIndex === 5 || stepSquareIndex === 8) {
                col = 'C';
            };

            let row;
            if (stepSquareIndex >= 0 && stepSquareIndex <= 2) {
                row = 'A';
            } else if (stepSquareIndex >= 3 && stepSquareIndex <= 5) {
                row = 'B';
            } else if (stepSquareIndex >= 6 && stepSquareIndex <= 8) {
                row = 'C';
            };

            const desc = move ?
                'Go to move #' + move + ' at (' + col + ', ' + row + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className="move-button">{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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

// ==============

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);