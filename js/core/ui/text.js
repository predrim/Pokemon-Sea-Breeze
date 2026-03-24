// Text related functions

// Text typewriter effect for dialogues
// Prepares text as span-wrapped characters and progressively reveals them in the dialogue box.
export function typeText(element, text, speed, i = 0, txtArr = [], charArray) {
    return new Promise((resolve) => {
        if (i === 0) {
            element.textContent = "";
        }

        if (text.length === 0) return resolve();

        // On first run, convert the text into individually wrapped characters
        // so we can animate each letter later without reprocessing
        if (i === 0) {
            txtArr.push(text
                // Split text into words, preserving separators
                .split(/([ ,.])/)
                .map(item => {
                    // Wrap each character in a span for per-letter animation
                    item = item
                        .split("")
                        .map(char => `<span class="char">${char}</span>`)
                        .join("");

                    // Wrap each word/group to preserve structure
                    item = `<span>${item}</span>`;

                    return item;
                })
                .join("")
            );

            // Inject the processed HTML into the element
            element.innerHTML = txtArr[0];
        };

        charArray = document.getElementsByClassName("char");

        charArray[i].style.opacity = 1;

        // if we reached the end of the string
        if (i === text.length - 1) {
            resolve(); // Warns that the text is over
            return;
        }

        setTimeout(() => { typeText(element, text, speed, i + 1, txtArr = [], charArray).then(resolve) }, speed);
    });
}