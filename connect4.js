"use strict"
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



class Game {
  //constructor height, width, maybe board
    constructor(height = 4, width = 4) {
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
  }

  /** Board constructed within the constructor methods */
  /** makeBoard: create in-JS board structure called arrayBoard:
  *   arrayBoard = array of rows, each row is array of cells  (arrayBoard[y][x])
  */
  makeArrayBoard() {
    
    this.arrayBoard = [];
    for (let y = 0; y < this.height; y++) {
      // need to debug syntax
      this.arrayBoard.push(Array.from({ length: this.width }))
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    //it is posssible to interact with Dom w/in the class =QUESTION!!
    const htmlBoard = document.getElementById('board');
    // this.board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    let handleClickInstance = this;
    // let thisHandleClick = handleClick.bind(this)
    // this.top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(handleClickInstance));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      // this.headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);
    // board.append(top);

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

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      //this.board[y][x]
      if (!this.arrayBoard[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
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

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in arrayBoard and add to HTML table
    this.arrayBoard[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // console.log("arrayBoard has updated at", y,x, this.arrayBoard)

    // TODO: Add timeout
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // TODO: Add timeout
    // check for tie
    if (this.arrayBoard.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;

  }
   _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    // console.log("within _win(), this is: ", this)
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.arrayBoard[y][x] === this.currPlayer
    );
  }
  //Question: 
  // best practice for creating helper fuction to be a difference method within
  // the same class
  /** checkForWin: check arrayBoard cell-by-cell for "does a win start here?" */
  checkForWin() {
    // console.log("within checkforwin(), this is: ", this, this.arrayBoard)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }

};


let newBoard = new Game();
// new makeHtmlBoard();
// console.log(newBoard.makeHTMLBoard().top);
newBoard.makeHtmlBoard();
newBoard.makeArrayBoard();
// console.log(newBoard.arrayBoard)