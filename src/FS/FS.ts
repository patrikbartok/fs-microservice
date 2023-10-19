import * as fs from "fs"
import * as crypto from "crypto"
import * as path from "path";

export class FS {
    private readonly baseDir: string;
    public fileMap: { [key: string]: string } = {};
    constructor(baseDir: string) {
        this.baseDir = baseDir;
    }

    async init() {
        await fs.promises.mkdir(this.baseDir, { recursive: true });
    }

    generateFileName(content: any) {
        const hash = crypto.createHash('md5').update(content).digest('hex');
        return hash.replace(/[^a-zA-Z]/g, ''); // Only keep alphabetical characters
    }

    async store(filename: string, content: any) {
        const hashFileName = this.generateFileName(content);
        const filePath = path.join(this.baseDir, hashFileName);
        try {
            await fs.promises.writeFile(filePath, content, { flag: "wx", encoding: "utf-8"});  //Throws error if file exists, with this we avoid race condition between exists and writeFile, simpler code
            this.fileMap[filename] = hashFileName;
            console.log(filename + " created");
        } catch (error: any) {
            if(error.code === "EEXIST") {
                this.fileMap[filename] = hashFileName;
                console.log(filename + " reference set to existing file content");
            } else {
                throw new Error(error.message)
            }
        }
    }

    async get(filename: string) {
        if(filename in this.fileMap){
            const filePath = path.join(this.baseDir, this.fileMap[filename]);
            return await fs.promises.readFile(filePath, { encoding: "utf-8"});
        } else {
            throw new Error("File is not found")
        }
    }
}

