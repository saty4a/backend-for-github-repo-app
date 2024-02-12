import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

export const writeFile = async (filePath, data) => {
    try {
        await fs.writeFile(path.resolve(__dirName, filePath), JSON.stringify(data, undefined, 2), (err)=> {
            if (err) {
                console.error(err);
                return "error";
            }
            else {
                return "done";
            }
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}