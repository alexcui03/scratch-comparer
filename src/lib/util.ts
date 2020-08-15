import * as Fs from 'fs';
import * as Path from 'path';

const soundFile = ['.wav', '.mp3'];
const imageFile = ['.svg', '.png'];

function rmdirSync(filePath: string): void {
    if (Fs.existsSync(filePath)) {
        let files: string[] = Fs.readdirSync(filePath);
        files.forEach(file => {
            let curPath = Path.join(filePath, file);
            if (Fs.statSync(curPath).isDirectory()) {
                rmdirSync(curPath);
            }
            else {
                Fs.unlinkSync(curPath);
            }
        });
        Fs.rmdirSync(filePath);
    }
}

export { rmdirSync, soundFile, imageFile };
