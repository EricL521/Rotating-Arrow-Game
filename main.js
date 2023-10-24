
// parse URL, if it has rows and columns, set them to the url values
const url = new URL(window.location.href);
const urlParams = url.searchParams;
const rows = parseInt(urlParams.get('rows'));
const columns = parseInt(urlParams.get('columns'));

const tableWidth = 400; // in px
// height will be calculated based on width
// define all the ids
const tableId = 'table';
const widthInputId = 'width';
const heightInputId = 'height';
const scrambleButtonId = 'scramble-button';
const winStateId = 'win-state';
const arrowImage = "Resources/Arrow.svg";

// gets the dimensions from the width and height inputs, and updates the table if they are valid
// returns cells if valid, null if not
const updateDimensions = (dimensions, widthInput, heightInput) => {
	const newDimensions = getDimensions(widthInput, heightInput);
	if (newDimensions[0] > 0 && newDimensions[1] > 0) {
		[dimensions[0], dimensions[1]] = newDimensions;
		// update url
		urlParams.set('rows', dimensions[0]);
		urlParams.set('columns', dimensions[1]);
		// set url to new url
		history.pushState(null, null, url);
		// if it is valid, generate new table
		return generateTable(dimensions, document.getElementById(tableId));
	}
	return null;
};
// returns [rows, columns] from width and height inputs
const getDimensions = (widthInput, heightInput) => {
	console.log([parseInt(heightInput.value), parseInt(widthInput.value)]	);
	return [parseInt(heightInput.value), parseInt(widthInput.value)];
};

// returns the 2d array of cells
// also clears adds the cells to the html table
const generateTable = (dimensions, tableElement) => {
	// clear table
	tableElement.innerHTML = '';
	// set table size
	tableElement.style.width = `${tableWidth}px`;
	tableElement.style.height = `${tableWidth * (dimensions[0] / dimensions[1])}px`;

	// create cells array to store cells
	const cells = [];
	for (let i = 0; i < dimensions[0]; i ++) {
		const row = document.createElement('tr');
		const rowCells = [];
		for (let j = 0; j < dimensions[1]; j ++) {
			const cell = document.createElement('td');
			cell.classList.add('cell');
			cell.onclick = () => onCellClick(cells, i, j); // add onclick
			cell.oncontextmenu = () => {onCellRightClick(cell); return false;}; // add right click detection
			// add to table and js array
			row.appendChild(cell);
			// create arrow in cell
			const arrow = document.createElement('img');
			arrow.src = arrowImage;
			arrow.classList.add('arrow');
			arrow.classList.add('up');
			arrow.style.transform = 'rotate(0deg)';
			arrow.draggable = false;
			cell.appendChild(arrow);
			
			// add cerll to row array
			rowCells.push(cell);
		}
		// add row to cells array
		cells.push(rowCells);
		tableElement.appendChild(row);
	}
	// update win state
	updateWinState();
	return cells;
};

// scrambles cells for a 2d array of cells
// also resets table cell colosr
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

			// remove green color
			cells[i][j].classList.remove('green-cell');
		}
	updateWinState();
};

// updates the text of the win state
const updateWinState = () => {
	if (document.getElementsByClassName('up').length == document.getElementsByClassName('cell').length)
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
// toggles the cell green
const onCellRightClick = (cell) => {
	if (cell.classList.contains('green-cell'))
		cell.classList.remove('green-cell');
	else
		cell.classList.add('green-cell');
}

// initialize everything
document.addEventListener('DOMContentLoaded', () => {
	// rows, columns
	let dimensions = [4, 4];

	const widthInput = document.getElementById(widthInputId);
	const heightInput = document.getElementById(heightInputId);
	
	// if url has valid dimensions, set them to the url values
	if (rows > 0 && columns > 0)
		dimensions = [rows, columns];
	// set values to match dimensions
	[widthInput.value, heightInput.value] = dimensions;

	// generate table
	let cells = generateTable(dimensions, document.getElementById(tableId));
	
	// add onclick to scramble button
	document.getElementById(scrambleButtonId).onclick = () => scramble(cells);
	// add oninput to width and height inputs
	widthInput.oninput = () => {
		const newCells = updateDimensions(dimensions, widthInput, heightInput);
		if (newCells) 
			cells = newCells;
	};
	heightInput.oninput = () => {
		const newCells = updateDimensions(dimensions, widthInput, heightInput);
		if (newCells)
			cells = newCells;
	}
});