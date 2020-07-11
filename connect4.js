"use strict"
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



class Game {
  /** initialize all instances with these properties */
    constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
    this.makeHtmlBoard();
    this.makeArrayBoard();
  }

  /** 
  Board constructed within the constructor methods 
  makeArrayBoard: create in-JS board structure called arrayBoard:
  contains array of rows, each row is array of cells  (arrayBoard[y][x])
  */
  makeArrayBoard() {
    
    this.arrayBoard = [];
    for (let y = 0; y < this.height; y++) {
      this.arrayBoard.push(Array.from({ length: this.width }))
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    //it is posssible to interact with Dom w/in the class =QUESTION!!
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    let handleClickInstance = this;
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(handleClickInstance));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        //add this to cell and & row below
        // give each cell an id according to its location
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
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

    // Delay alert so that piece is placed in HTMLBoard
    // check for win
    if (this.checkForWin()) {
      setTimeout(() => {
        this.endGame(`Player ${this.currPlayer} won!`);
      }, 10);
    }

    // Delay alert so that piece is placed in HTMLBoard
    // check for tie
    if (this.arrayBoard.every(row => row.every(cell => cell))) {
      setTimeout(() => {
        this.endGame('Tie!');
      }, 10);
    }

    // Delay player switch until checkForWin() && tie is run
    // switch players
    setTimeout(() => {
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }, 20);


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
  //Question: best practice for creating helper fuction within a method

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


let newBoard = new Game(6, 7);
// new makeHtmlBoard();
// console.log(newBoard.makeHTMLBoard().top);
// newBoard.makeHtmlBoard();
// newBoard.makeArrayBoard();
// console.log(newBoard.arrayBoard)