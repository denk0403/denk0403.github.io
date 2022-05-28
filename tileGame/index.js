/** @type {HTMLButtonElement} */
const createBoardBtn = document.getElementById("create-board-btn");
/** @type {HTMLInputElement} */
const boardWidthInput = document.getElementById("board-width-input");
/** @type {HTMLInputElement} */
const boardHeightInput = document.getElementById("board-height-input");
/** @type {HTMLSelectElement} */
const boardTypeSelect = document.getElementById("board-type-select");
/** @type {HTMLInputElement} */
const showClickedBtn = document.getElementById("show-clicked-btn");
/** @type {HTMLDialogElement} */
const errorDialog = document.getElementById("error-dialog");
/** @type {HTMLParagraphElement} */
const errorDialogText = document.getElementById("error-dialog-text");
/** @type {HTMLButtonElement} */
const closeErrorDialogBtn = document.getElementById("close-error-dialog-btn");
/** @type {HTMLDivElement} */
const matchBoardParent = document.getElementById("match-board-parent");
/** @type {HTMLDivElement} */
const interactiveBoardParent = document.getElementById("interactive-board-parent");
/** @type {HTMLDivElement} */
const differenceBoardParent = document.getElementById("difference-board-parent");

closeErrorDialogBtn.addEventListener("click", () => {
	errorDialog.close();
});

showClickedBtn.addEventListener("click", () => {
	if (showClickedBtn.checked) {
		interactiveBoardParent.classList.add("show-clicked");
	} else {
		interactiveBoardParent.classList.remove("show-clicked");
	}
});

/**
 * @typedef Board
 * @property {boolean[]} cells
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef State
 * @property {Board} matchBoard
 * @property {Board} userBoard
 * @property {Set<number>} clicked
 */

/** @type {State} */
const state = {
	matchBoard: null,
	userBoard: null,
	clicked: null,
};

/**
 *
 * @param {number} width
 * @param {number} height
 * @returns {Board}
 */
function createCheckerboardBoard(width, height) {
	let startActive = true;
	const cells = [];
	for (let row = 0; row < height; row++) {
		let isActive = startActive;
		for (let col = 0; col < width; col++) {
			cells.push(isActive);
			isActive = !isActive;
		}
		startActive = !startActive;
	}

	return {
		cells,
		width,
		height,
	};
}

function createRandomBoard(width, height) {
	const cells = [];
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			const isActive = Math.random() > 0.5;
			cells.push(isActive);
		}
	}

	return {
		cells,
		width,
		height,
	};
}

function createFilledBoard(width, height) {
	const cells = [];
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			cells.push(true);
		}
	}

	return {
		cells,
		width,
		height,
	};
}

function createSquareBoard(width, height) {
	const cells = [];
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			const isEdgeCell = row === 0 || row === height - 1 || col === 0 || col === width - 1;
			if (isEdgeCell) {
				cells.push(true);
			} else {
				cells.push(false);
			}
		}
	}

	return {
		cells,
		width,
		height,
	};
}

function createCircleBoard(width, height) {
	const cells = [];
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			const isEdgeCell = row === 0 || row === height - 1 || col === 0 || col === width - 1;
			const isCorner =
				(row === 0 && col === 0) ||
				(row === 0 && col === width - 1) ||
				(row === height - 1 && col === 0) ||
				(row === height - 1 && col === width - 1);
			if (isEdgeCell && !isCorner) {
				cells.push(true);
			} else {
				cells.push(false);
			}
		}
	}

	return {
		cells,
		width,
		height,
	};
}

const BOARD_PATTERNS = ["checkerboard", "random", "filled"];

const BOARD_PATTERN_DISPATCHER = {
	checkerboard: createCheckerboardBoard,
	random: createRandomBoard,
	filled: createFilledBoard,
	square: createSquareBoard,
	circle: createCircleBoard,
};

function readWidth() {
	return boardWidthInput.valueAsNumber || throwError("Invalid board width");
}

function readHeight() {
	return boardHeightInput.valueAsNumber || throwError("Invalid board height");
}

function readBoardType() {
	const result = boardTypeSelect.value;

	if (!(result in BOARD_PATTERN_DISPATCHER)) {
		throwError(`Unknown board type: "${result}"`);
	}

	return result;
}

/**
 * @param {String} str
 * @throws
 */
function throwError(str) {
	errorDialogText.textContent = str;
	errorDialog.showModal();
	throw Error(str);
}

/**
 * @param {Board}
 */
function renderMatchBoard({ cells, width, height }) {
	matchBoardParent.textContent = "";

	for (let row = 0; row < height; row++) {
		const htmlBoardRow = document.createElement("div");
		htmlBoardRow.classList.add("board-row");

		for (let col = 0; col < width; col++) {
			const cellIndex = row * width + col;
			const newCell = document.createElement("div");
			newCell.classList.add("board-cell");
			if (cells[cellIndex]) {
				newCell.classList.add("active");
			} else {
				newCell.classList.add("inactive");
			}

			newCell.addEventListener("click", () => {
				const newCells = [...cells];
				newCells[cellIndex] = !cells[cellIndex];
				const newBoard = { cells: newCells, width, height };
				state.matchBoard = newBoard;
				state.userBoard = newBoard;
				state.clicked = new Set();
				renderBoardStates();
			});

			htmlBoardRow.appendChild(newCell);
		}

		matchBoardParent.appendChild(htmlBoardRow);
	}
}

/**
 * @param {Board} board
 */
function renderInteractiveBoard(board, clicked) {
	const { cells, width, height } = board;
	interactiveBoardParent.textContent = "";

	for (let row = 0; row < height; row++) {
		const htmlBoardRow = document.createElement("div");
		htmlBoardRow.classList.add("board-row");

		for (let col = 0; col < width; col++) {
			const cellIndex = row * width + col;
			const newCell = document.createElement("div");
			newCell.classList.add("board-cell");
			if (cells[cellIndex]) {
				newCell.classList.add("active");
			} else {
				newCell.classList.add("inactive");
			}

			if (state.clicked.has(cellIndex)) {
				newCell.classList.add("clicked");
			}

			newCell.addEventListener("click", () => {
				if (state.clicked.has(cellIndex)) {
					state.clicked.delete(cellIndex);
				} else {
					state.clicked.add(cellIndex);
				}
				state.userBoard = flipBoardCell(board, row, col);
				renderBoardStates();
			});

			htmlBoardRow.appendChild(newCell);
		}

		interactiveBoardParent.appendChild(htmlBoardRow);
	}
}

/**
 * @param {Board} board
 */
function renderDifferenceBoard(board) {
	const { cells, width, height } = board;
	differenceBoardParent.textContent = "";

	for (let row = 0; row < height; row++) {
		const htmlBoardRow = document.createElement("div");
		htmlBoardRow.classList.add("board-row");

		for (let col = 0; col < width; col++) {
			const cellIndex = row * width + col;
			const newCell = document.createElement("div");
			newCell.classList.add("board-cell");
			if (cells[cellIndex]) {
				newCell.classList.add("bad");
			} else {
				newCell.classList.add("good");
			}

			const activeNeighborCount = getNeighborBoardCellIndices(board, row, col)
				.map((cellIndex) => cells[cellIndex])
				.filter((isActive) => isActive).length;

			newCell.textContent = activeNeighborCount;

			htmlBoardRow.appendChild(newCell);
		}

		differenceBoardParent.appendChild(htmlBoardRow);
	}
}

/**
 * @param {Board} board1
 * @param {Board} board2
 * @returns {Board}
 */
function createDifferenceBoard(board1, board2) {
	if (board1.width !== board2.width || board1.height !== board2.height) {
		throwError(`Boards have unequal dimensions: Board 1 ${board1}\n Board 2 ${board2}`);
	}

	const diffCells = [];
	for (let cellIndex = 0; cellIndex < board1.cells.length; cellIndex++) {
		const isActive = board1.cells[cellIndex] !== board2.cells[cellIndex];
		diffCells.push(isActive);
	}

	return {
		cells: diffCells,
		width: board1.width,
		height: board1.height,
	};
}

const renderStateCache = {};
function renderBoardStates() {
	let rerenderDifference = false;

	if (state.matchBoard !== renderStateCache.matchBoard) {
		rerenderDifference = true;
		renderMatchBoard(state.matchBoard);
		renderStateCache.matchBoard = state.matchBoard;
	}
	if (state.userBoard !== renderStateCache.userBoard) {
		rerenderDifference = true;
		renderInteractiveBoard(state.userBoard, state.clicked);
		renderStateCache.userBoard = state.userBoard;
	}

	if (rerenderDifference) {
		renderDifferenceBoard(createDifferenceBoard(state.matchBoard, state.userBoard));
	}
}

/**
 *
 * @param {Board}
 * @param {number} row
 * @param {number} col
 */
function getBoardCellIndex({ cells, width, height }, row, col) {
	if (row < 0 || row > height - 1) {
		throwError(`Unexpected row "${row}" while getting cell index for ${cells}`);
	}

	if (col < 0 || col > width - 1) {
		throwError(`Unexpected col "${col}" while getting cell index for ${cells}`);
	}

	return row * width + col;
}

/**
 *
 * @param {Board} board
 * @param {number} row_of_center
 * @param {number} col_of_center
 */
function getNeighborBoardCellIndices(board, row_of_center, col_of_center) {
	const { width, height } = board;
	const neighborCellPositions = [
		[row_of_center - 1, col_of_center - 1],
		[row_of_center - 1, col_of_center],
		[row_of_center - 1, col_of_center + 1],
		[row_of_center, col_of_center - 1],
		[row_of_center, col_of_center],
		[row_of_center, col_of_center + 1],
		[row_of_center + 1, col_of_center - 1],
		[row_of_center + 1, col_of_center],
		[row_of_center + 1, col_of_center + 1],
	];

	const validNeighborCellIndices = neighborCellPositions
		.filter(([row, col]) => row >= 0 && row < height && col >= 0 && col < width)
		.map(([row, col]) => getBoardCellIndex(board, row, col));

	return validNeighborCellIndices;
}

/**
 *
 * @param {Board} board
 * @param {number} row
 * @param {number} col
 * @returns {Board}
 */
function flipBoardCell(board, row, col) {
	const { cells, width, height } = board;
	const neighborIndices = getNeighborBoardCellIndices(board, row, col);
	const newCells = cells.map((isActive, index) =>
		neighborIndices.includes(index) ? !isActive : isActive
	);

	return { cells: newCells, width, height };
}

/**
 *
 * @param {Board} board
 * @param {number} row
 * @param {number} col
 * @returns {Board}
 */
function flipBoardCellInPlace(board, row, col) {
	const { cells } = board;
	const neighborIndices = getNeighborBoardCellIndices(board, row, col);

	cells.forEach((isActive, index) => {
		cells[index] = neighborIndices.includes(index) ? !isActive : isActive;
	});
}

/**
 *
 * @param {Board} board1
 * @param {Board} board2
 */
function areEqualBoards(board1, board2) {
	if (board1.width !== board2.width || board1.height !== board2.height) {
		return false;
	}

	const cells1 = board1.cells;
	const cells2 = board2.cells;

	return cells1.every((isActive, index) => isActive === cells2[index]);
}

/**
 *
 * @param {Board} matchBoard
 * @param {Board} startBoard
 * @param {number} movesRemaining
 */
function solveBoard(matchBoard, startBoard, movesRemaining) {
	if (matchBoard.width !== startBoard.width || matchBoard.height !== startBoard.height) {
		throwError("Can't solve board of unequal dimensions");
	}
	if (movesRemaining <= 0) {
		throwError(`Invalid # of moves to solve: ${movesRemaining}`);
	}

	if (areEqualBoards(matchBoard, startBoard)) {
		throwError("Boards are already solved");
	}

	return solveBoardHelper(matchBoard, startBoard, movesRemaining, new Set(), 0);
}

/**
 *
 * @param {Board} board
 * @param {number} moves
 */
function applyMovesInPlace(board, moves) {
	console.log(moves);

	const { width, height } = board;

	for (const move of moves) {
		const cellRow = Math.floor(move / width);
		const cellCol = Math.floor(move % height);
		flipBoardCellInPlace(board, cellRow, cellCol);
	}
}

/**
 *
 * @param {Board} matchBoard
 * @param {Board} startBoard
 * @param {number} movesRemaining
 * @param {Set<number>} moves
 * @param {number} nextCell
 */
function solveBoardHelper(matchBoard, startBoard, movesRemaining, moves, nextCell) {
    if (movesRemaining === 0) {

		// apply moves
		applyMovesInPlace(startBoard, moves);

		// check if solves
		if (areEqualBoards(matchBoard, startBoard)) {
			return moves;
        }

        // undo moves
		applyMovesInPlace(startBoard, moves);

		return null;
	} else {
		for (
			let cellToTry = nextCell;
			cellToTry < startBoard.cells.length - movesRemaining + 1;
			cellToTry++
		) {
			moves.add(cellToTry);

			const result = solveBoardHelper(
				matchBoard,
				startBoard,
				movesRemaining - 1,
				moves,
				cellToTry + 1
			);

			if (!!result) {
				return result;
			}

			moves.delete(cellToTry);
		}
		return null;
	}
}

createBoardBtn.addEventListener("click", (evt) => {
	evt.preventDefault();

	const width = readWidth();
	const height = readHeight();
	const boardType = readBoardType();

	const newBoard = BOARD_PATTERN_DISPATCHER[boardType](width, height);

	state.userBoard = newBoard;
	state.matchBoard = newBoard;
	state.clicked = new Set();

	renderBoardStates();
});
createBoardBtn.click();
