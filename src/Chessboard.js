import React, {Component} from "react";
import Chessground from "react-chessground";
import Chess from "chess.js";
import "react-chessground/dist/styles/chessground.css";
import "./Chessboard.css";

class Chessboard extends Component {
    constructor(props) {
        super(props);
        this.state = {chess: new Chess(), pendingMove: null, fen: "", lastMove: null};
        this.turnColor = this.turnColor.bind(this);
        this.calcMovable = this.calcMovable.bind(this);
        this.onMove = this.onMove.bind(this);
        this.randomMove = this.randomMove.bind(this);
    }

    onMove(from, to) {
        let moves = this.state.chess.moves({verbose: true})
        for (let i = 0, len = moves.length; i < len; i++) {
            if(moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
                this.setState({
                    pendingMove: [from, to]
                });
                this.promotion()
                return;
            }
        }
        if (this.state.chess.move({from, to, promotion: "x"})) {
            this.setState({
                fen: (this.state.chess.fen()),
                lastMove: [from, to]
            })
            setTimeout(this.randomMove, 500);
        }
        this.game_over();
    }

    randomMove() {
        let moves = this.state.chess.moves({verbose: true});
        let move = moves[Math.floor(Math.random() * moves.length)];
        if (moves.length > 0) {
            this.state.chess.move(move.san)
            this.setState({
                fen: this.state.chess.fen(),
                lastMove: [move.from, move.to]
            })
        }
    }

    promotion() {
        let from = this.state.pendingMove[0];
        let to = this.state.pendingMove[1];
        this.state.chess.move({from, to, promotion: "q"})
        this.setState({
            fen: this.state.chess.fen(),
            lastMove: [from, to]
        })
        setTimeout(this.randomMove, 500)
    }

    turnColor() {
        return this.state.chess.turn() === "w" ? "white" : "black"
    }

    calcMovable() {
        let dests = new Map();
        this.state.chess.SQUARES.forEach(s => {
            let ms = this.state.chess.moves({square: s, verbose: true});
            if (ms.length) dests.set(s, ms.map(m => m.to));
        })
        return {
            free: false,
            dests,
            color: "white"
        }
    }

    game_over() {
        let loser = this.turnColor();
        if (this.state.chess.in_threefold_repetition()) return alert("Draw due to repition");
        if (this.state.chess.in_draw()) return alert("This is a draw");
        if(this.state.chess.in_stalemate()) return alert("This is a stalemate");
        if(this.state.chess.insufficient_material()) return alert("Insufficient material: this is a draw");
        if (this.state.chess.in_checkmate()) return loser === "black" ? alert("Game Over: White Wins") : alert("Game Over: Black Wins")
    }

    render() {
        return (
            <div>
                <h1 className="Title">CHESS</h1>
                <div className="Chessboard">
                    <Chessground 
                        width="500px" 
                        height="500px"
                        turnColor={this.turnColor()}
                        movable={this.calcMovable()}
                        lastMove={this.state.lastMove}
                        fen={this.state.fen}
                        onMove={this.onMove}
                        style={{boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                                margin: "auto"}}
                    />
                </div>
            </div>
        )   
    }
}

export default Chessboard;