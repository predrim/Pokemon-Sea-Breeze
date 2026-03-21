import { Boundary } from "../classes/Boundary.js";

// Utility Functions

// Copy every row from symbolsArray and pushes them into rowsArray
export function copyRows(rowsArray, symbolsArray, rowSize) {
    for (let i = 0; i < symbolsArray.length; i += rowSize) {
        rowsArray.push(symbolsArray.slice(i, i + rowSize));
    };
}

/**
 * Creates "Boundary" objects from tile data.
 * Each non-zero tile represents an active boundary or trigger.
 */
export function makeBoundaries(RowsArray, offset) {
    const boundaries = [];

    RowsArray.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol !== 0) {
                const boundary = new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
                boundary.symbol = symbol;
                boundaries.push(boundary);
            }
        })
    });

    return boundaries;
}

export function wait(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds*1000);
    });
}

// Text typewriter effect
export function textTypingEffect(element, text, speed, i=0) {
    if (i === 0) {
        element.textContent="";
    }

    element.textContent += text[i];

    // if we reached the end of the string
    if (i === text.length - 1) {
        return;
    }

    setTimeout(() => textTypingEffect(element, text, speed, i + 1), speed)
}