export class AssetLoader {
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(`Failed to load image ${src}`);
        });
    }

    async loadMap(mapManifestEntry) {
        // 1. Fetch the JSON config
        const response = await fetch(mapManifestEntry.configUrl);
        const mapConfig = await response.json();

        return mapConfig;
    }

}