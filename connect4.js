"use strict"
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



class Game {
  //constructor height, width, maybe board
  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    // create a 2D array to track player piece
    // board = array of rows, each row is array of cells  (board[y][x])
    this.board = Array(this.heigth).fill(null).map(() => Array(this.width).fill(null));
    // this.board2 = this.makeArrayBoard();
    // this.board3 = this.makeArrayBoard(this.width,this.height);
    this.currPlayer = 1;
  }

  /** Board constructed within the constructor methods */
  /** makeArrayBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeArrayBoard(width, height) {
    // function makeBoard() {
//   for (let y = 0; y < HEIGHT; y++) {
//     board.push(Array.from({ length: WIDTH }));
//   }
// }
    for (let y = 0; y < height; y++) {
      // need to debug syntax
      this.board.push(Array.from({ length: width }))
    }
    // console.log(this.board);
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    //it is posssible to interact with Dom w/in the class =QUESTION!!
    const htmlBoard = document.getElementById('html-board');

    // make column tops (clickable area for adding a piece to that column)
    const htmlTop = document.createElement('tr');
    let handleClickInstance = this;
    // let thisHandleClick = handleClick.bind(this);
    htmlTop.setAttribute('id', 'column-top');
    htmlTop.addEventListener('click', this.handleClick.bind(handleClickInstance));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      htmlTop.append(headCell);
    }

    htmlBoard.append(htmlTop);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      // this.row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        // this.cell = document.createElement('td');
        //add this to cell and & row below
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x (passed in from handleClick), return top empty y (null if filled) */
  findSpotForCol(x) {
    console.log("this outside", this)
    for (let y = this.height - 1; y >= 0; y--) {
      this.board[y][x]
      console.log("this inside", this, "this.board", this.board, "this.board[y][x]", this.board[1])
      console.log("y", y, "this.x: ", this.x)
      if (!this.board[y][x]) {
        return y;
      }
    }
    // Joel says: figureout what this is
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  // receive arguments from
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`); //  question!
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column htmlTop to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  //Question: 
  // best practice for creating helper fuction to be a difference method within
  // the same class
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    function _win(cells) { //static?
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

};


let newBoard = new Game();
// new makeHtmlBoard();
console.log("board1:", newBoard.board, "board2: ", newBoard.board2);
newBoard.makeHtmlBoard();
