/** @type {HTMLButtonElement} */
const createBoardBtn = document.getElementById("create-board-btn");
/** @type {HTMLInputElement} */
const boardWidthInput = document.getElementById("board-width-input");
/** @type {HTMLInputElement} */
const boardHeightInput = document.getElementById("board-height-input");
/** @type {HTMLSelectElement} */
const boardTypeSelect = document.getElementById("board-type-select");
/** @type {HTMLDialogElement} */
const errorDialog = document.getElementById("error-dialog");
/** @type {HTMLParagraphElement} */
const errorDialogText = document.getElementById("error-dialog-text");
/** @type {HTMLButtonElement} */
const matchBoardParent = document.getElementById("match-board-parent");
/** @type {HTMLDivElement} */
const userBoardParent = document.getElementById("user-board-parent");
/** @type {HTMLInputElement} */
const numMovesInput = document.getElementById("num-moves-input");

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
 */

/** @type {State} */
const state = {
	matchBoard: null,
	userBoard: null,
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

function readNumOfMoves() {
	return numMovesInput.valueAsNumber || throwError("Invalid number of moves.");
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
 * @param {HTMLElement} parent
 * @param {(board: Board) => any} callback
 */
function renderBoard({ cells, width, height }, parent, callback) {
	parent.textContent = "";

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
				callback(newBoard);

				renderBoardStates();
			});

			htmlBoardRow.appendChild(newCell);
		}

		parent.appendChild(htmlBoardRow);
	}
}

const renderStateCache = {};
function renderBoardStates() {
	if (state.matchBoard !== renderStateCache.matchBoard) {
		renderBoard(state.matchBoard, matchBoardParent, (board) => {
			state.matchBoard = board;
		});
		renderStateCache.matchBoard = state.matchBoard;
	}
	if (state.userBoard !== renderStateCache.userBoard) {
		renderBoard(state.userBoard, userBoardParent, (board) => {
			state.userBoard = board;
		});
		renderStateCache.userBoard = state.userBoard;
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
			// undo moves
			applyMovesInPlace(startBoard, moves);
			return moves;
		} else {
			// undo moves
			applyMovesInPlace(startBoard, moves);
			return null;
		}
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

/**
 *
 * @param {NodeListOf<HTMLDivElement>} domCells
 * @param {Iterable<number>} cellIndices
 */
function highlightCells(domCells, cellIndices) {
	for (const cellIndex of cellIndices) {
		domCells[cellIndex].classList.add("highlight");
	}
}

function init() {
	/** @type {HTMLButtonElement} */
	const incrWidthBtn = document.getElementById("incr-width-btn");
	incrWidthBtn.addEventListener("click", () => {
		const width = readWidth();
		if (width) {
			boardWidthInput.valueAsNumber += 1;
		} else {
			boardWidthInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const decrWidthBtn = document.getElementById("decr-width-btn");
	decrWidthBtn.addEventListener("click", () => {
		const width = readWidth();
		if (width && width > 1) {
			boardWidthInput.valueAsNumber -= 1;
		} else {
			boardWidthInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const incrHeightBtn = document.getElementById("incr-height-btn");
	incrHeightBtn.addEventListener("click", () => {
		const height = readHeight();
		if (height) {
			boardHeightInput.valueAsNumber += 1;
		} else {
			boardHeightInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const decrHeightBtn = document.getElementById("decr-height-btn");
	decrHeightBtn.addEventListener("click", () => {
		const height = readHeight();
		if (height && height > 1) {
			boardHeightInput.valueAsNumber -= 1;
		} else {
			boardHeightInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const incrMovesBtn = document.getElementById("incr-moves-btn");
	incrMovesBtn.addEventListener("click", () => {
		const moves = readNumOfMoves();
		if (moves) {
			numMovesInput.valueAsNumber += 1;
		} else {
			numMovesInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const decrMovesBtn = document.getElementById("decr-moves-btn");
	decrMovesBtn.addEventListener("click", () => {
		const moves = readNumOfMoves();
		if (moves) {
			numMovesInput.valueAsNumber -= 1;
		} else {
			numMovesInput.valueAsNumber = 1;
		}
	});

	/** @type {HTMLButtonElement} */
	const copyToUserBtn = document.getElementById("copy-to-user-btn");
	copyToUserBtn.addEventListener("click", () => {
		state.userBoard = state.matchBoard;
		renderBoardStates();
	});

	/** @type {HTMLButtonElement} */
	const closeErrorDialogBtn = document.getElementById("close-error-dialog-btn");
	closeErrorDialogBtn.addEventListener("click", () => {
		errorDialog.close();
	});

	createBoardBtn.addEventListener("click", (evt) => {
		evt.preventDefault();

		const width = readWidth();
		const height = readHeight();
		const boardType = readBoardType();

		const newBoard = BOARD_PATTERN_DISPATCHER[boardType](width, height);

		state.userBoard = newBoard;
		state.matchBoard = newBoard;

		renderBoardStates();
	});

	/** @type {HTMLButtonElement} */
	const solveBtn = document.getElementById("solve-btn");
	solveBtn.addEventListener("click", (evt) => {
		evt.preventDefault();

		const solution = solveBoard(state.matchBoard, state.userBoard, readNumOfMoves());

		if (!solution) {
			throwError("No solution for given board configuration");
		} else {
			const domCells = document.querySelectorAll("#user-board-parent .board-cell");
			highlightCells(domCells, solution);
		}
	});
}

init();
createBoardBtn.click();
