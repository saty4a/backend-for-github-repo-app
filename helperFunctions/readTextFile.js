import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
const encoding = "utf8";

export const readFile = async (filePath) => {
    try {
        const data = await fs.readFile(path.resolve(__dirName, filePath), encoding);
        if(data){
            const obj = JSON.parse(data);
            return obj;
        }
    } catch (error) {
        console.log(error);
    }
}