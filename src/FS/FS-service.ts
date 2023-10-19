import { FS } from './FS'
import path from 'path'
import express, {Express} from 'express';

export default class FSService {
    private readonly app: Express;
    private readonly port: number;
    private readonly directoryPath: string;
    private fsInstance: FS;

    constructor() {
        this.app = express();
        this.port = 3000;
        this.directoryPath = path.join(__dirname, 'fileDir');
        this.fsInstance = new FS(this.directoryPath);
    }

    async init() {
        try {
            await this.fsInstance.init()
        } catch (error: any) {
            console.error(error)
        }

        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use(express.json());

        this.app.get('/get-file-content/:filename', async (req, res) => {
            const filename = req.params.filename

            try {
                const file = await this.fsInstance.get(filename)
                res.status(200).send(file)
            } catch (error: any) {
                res.status(500).send(error.message)
            }
        })

        this.app.post('/post-file', async (req, res) => {
            const { fileName, fileContent } = req.body

            try {
                await this.fsInstance.store(fileName, fileContent)
                res.status(200).send('File stored')
            } catch (error: any) {
                res.status(500).send(error.message)
            }
        })
    }

    start() {
        this.app.listen(this.port, ()=>{
            console.log(`Microservice is listening on port ${(this.port)}!`)
        })
    }
}





