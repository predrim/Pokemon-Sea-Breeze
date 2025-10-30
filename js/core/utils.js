// Utility Functions

// Copy every row from tilesArray and pushes them into arrayMap
export function copyRows(arrayMap, tilesArray, rowSize) {
    for (let i = 0; i < tilesArray.length; i += rowSize) {
        arrayMap.push(tilesArray.slice(i, i + rowSize));
    };
}

