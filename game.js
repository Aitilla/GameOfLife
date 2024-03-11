const gameGrid = document.getElementById('gameGrid');
const generation = document.getElementById('generation');
const gridSize = 20;

// Set generation
let currentGeneration = 0;
generation.textContent = currentGeneration;

// Define an array to store all cells
let allCells = [];

// Function to create the grid
function createGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Define rows and columns
            cell.dataset.row = i;
            cell.dataset.col = j;

            // Assign an id to each cell based on its row and column
            cell.id = `cell-${i}-${j}`;

            // Set living and non-living cells
            cell.textContent = Math.random() > 0.5 ? '*' : '-';

            // Append the cell to the game grid
            gameGrid.appendChild(cell);

            // Push the cell to the allCells array
            allCells.push(cell);
        }
    }
}

// Function to get neighbors of a cell
function getNeighbors(row, col) {
    const neighbors = [];

    // Says where each neighbor should be
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dRow, dCol] of offsets) {
        const neighborRow = row + dRow;
        const neighborCol = col + dCol;

        // Check if the neighbor is within the bounds of the grid
        if (neighborRow >= 0 && neighborRow < gridSize && neighborCol >= 0 && neighborCol < gridSize) {
            neighbors.push([neighborRow, neighborCol]);
        }
    }

    return neighbors;
}

// Function to apply rules to each cell
function applyRules() {
    // Create a copy of allCells array to avoid modifying it while iterating
    const cellsCopy = [...allCells];

    for (const cell of cellsCopy) {
        // Get the row and column indices of the current cell
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Get the coordinates of its neighbors
        const neighbors = getNeighbors(row, col);

        // Count the number of alive neighbors
        let aliveNeighbors = 0;
        for (const [neighborRow, neighborCol] of neighbors) {
            const neighborCell = document.getElementById(`cell-${neighborRow}-${neighborCol}`);
            if (neighborCell.textContent === '*') {
                aliveNeighbors++;
            }
        }

        // Apply the rules based on the current state of the cell and the number of alive neighbors
        if (cell.textContent === '*') {
            if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                // Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                // Any live cell with more than three live neighbors dies, as if by overpopulation.
                cell.textContent = '-';
            }
        } else {
            if (aliveNeighbors === 3) {
                // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                cell.textContent = '*';
            }
        }
    }

    // Update generation
    currentGeneration++;
    generation.textContent = currentGeneration;
}

// Create the grid
createGrid();

// Run generation ever 0.5 seconds
setInterval(applyRules, 500);
