
// rows, columns
const dimensions = [4, 4];
const transitionDuration = 0.2; // seconds
const tableId = 'table';
const scrambleButtonId = 'scramble-button';
const winStateId = 'win-state';
const arrowImage = "Resources/Arrow.svg";

// returns the 2d array of cells
const generateTable = (tableElement, dimensions) => {
	const cells = [];
	for (let i = 0; i < dimensions[0]; i ++) {
		const row = document.createElement('tr');
		const rowCells = [];
		for (let j = 0; j < dimensions[1]; j ++) {
			const cell = document.createElement('td');
			cell.classList.add('cell');
			// add to table and js array
			row.appendChild(cell);
			// create arrow in cell
			const arrow = document.createElement('img');
			arrow.src = arrowImage;
			arrow.classList.add('arrow');
			arrow.classList.add('up');
			arrow.style.transform = 'rotate(0deg)';
			cell.appendChild(arrow);
			
			rowCells.push(cell);
		}
		cells.push(rowCells);
		tableElement.appendChild(row);
	}
	return cells;
};

// scrambles cells for a 2d array of cells
const scramble = (cells) => {
	// set each cell to random state
	for (let i = 0; i < cells.length; i ++)
		for (let j = 0; j < cells[0].length; j ++) {
			// remove current state and add new one
			cells[i][j].children[0].classList.remove('up', 'right', 'down', 'left');
			const newState = states[Math.floor(Math.random() * 4)];
			cells[i][j].children[0].classList.add(newState);
			// set transform
			cells[i][j].children[0].style.transform = `rotate(${90 * statesMap[newState]}deg)`;
		}
	updateWinState();
};

// updates the text of the win state
const updateWinState = () => {
	if (document.getElementsByClassName('up').length == dimensions[0] * dimensions[1])
		document.getElementById(winStateId).innerHTML = 'Solved!';
	else
		document.getElementById(winStateId).innerHTML = 'Unsolved...';
};

const states = ['up', 'right', 'down', 'left'];
const statesMap = {'up': 0, 'right': 1, 'down': 2, 'left': 3};
// takes in html element
const rotateCell = (cell) => {
	// get arrow child element
	const arrow = cell.children[0];
	// get current state
	const currentState = statesMap[arrow.classList[1]];
	// rotate to next state
	const newState = (currentState + 1) % 4;
	arrow.classList.remove(states[currentState]);
	arrow.classList.add(states[newState]);
	// update transform by just adding 90 degrees
	const currentTransform = parseInt(arrow.style.transform.replace(/\D/g, ""));
	arrow.style.transform = `rotate(${currentTransform + 90}deg)`;
};
// rotates all neighbros on a cell click
const onCellClick = (cells, row, column) => {
	// rotate all neighbors
	for (let i = -1; i <= 1; i ++)
		for (let j = -1; j <= 1; j ++)
			if (row + i >= 0 && row + i < cells.length && column + j >= 0 && column + j < cells[0].length)
				rotateCell(cells[row + i][column + j]);
	updateWinState();
};

document.addEventListener('DOMContentLoaded', () => {
	// generate table
	const cells = generateTable(document.getElementById(tableId), dimensions);
	// add onclicks to cells
	for (let i = 0; i < cells.length; i ++)
		for (let j = 0; j < cells[0].length; j ++)
			cells[i][j].onclick = () => onCellClick(cells, i, j);
	updateWinState();
	
	// add onclick to scramble button
	document.getElementById(scrambleButtonId).onclick = () => scramble(cells);
});