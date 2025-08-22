import * as THREE from 'three';

export class LabeledCube {
    private readonly cube: THREE.Mesh;

    constructor(labels: string[]) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        // Jede Seite bekommt eine Text-Textur
        const materials = labels.map(label => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '28px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            return new THREE.MeshBasicMaterial({ map: texture });
        });

        this.cube = new THREE.Mesh(geometry, materials);
    }

    get mesh(): THREE.Mesh {
        return this.cube;
    }
}
