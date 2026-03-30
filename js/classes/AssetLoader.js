export class AssetLoader {
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(`Failed to load image ${src}`);
        });
    }

    async loadFont(name, url) {
        const font = new FontFace(name, `url(${url})`);
            try {
                const loadedFont = await font.load();
                document.fonts.add(loadedFont);
                console.log(`Font loaded: ${name}`);
                return loadedFont;
            } catch (err) {
                console.error(`Failed to load font: ${name}`, err);
            }
    }

    async loadMap(mapManifestEntry) {
        const response = await fetch(mapManifestEntry.configUrl);
        const mapConfig = await response.json();

        return mapConfig;
    }

}