// Utility Functions

// Copy every row from symbolsArray and pushes them into rowsArray
export function copyRows(rowsArray, symbolsArray, rowSize) {
    for (let i = 0; i < symbolsArray.length; i += rowSize) {
        rowsArray.push(symbolsArray.slice(i, i + rowSize));
    };
}

