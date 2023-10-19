import {FS} from "./FS";
import fs from "fs";
import exp from "constants";

const testDir = 'test-storage';
const testFileContent = 'Hello, world!';

// Create an instance of FS before running tests
const fsInstance = new FS(testDir);

describe('Testing FS class', () => {

    beforeAll(async () => {
        await fsInstance.init()

        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    })

    afterAll(async () => {
        // Clean up the test directory after tests
        fs.rmSync(testDir, { recursive: true });
    });

    test('should store and retrieve a file', async () => {
        const testFileName = 'test.txt';

        // Store test.txt file
        await fsInstance.store(testFileName, testFileContent);

        // Retrieve the file
        const retrievedContent1 = await fsInstance.get(testFileName);

        // Check if the content is correct
        expect(retrievedContent1).toEqual(testFileContent);
    });

    test('should not write a new file, just store the hash', async ()=> {
        const testFileName2 = 'test2.txt';

        // Store test2.txt file
        await fsInstance.store(testFileName2, testFileContent);

        // Get the file & check if the content is correct
        const retrievedContent2 = await fsInstance.get(testFileName2);
        expect(retrievedContent2).toEqual(testFileContent);

        // Read the amount of files in dir & check if its 1
        const filesInDirectory = fs.readdirSync(testDir);
        expect(filesInDirectory.length).toBe(1);

    })

    test('should handle an error when getting a non-existing file', async () => {
        try {
            await fsInstance.get('non-existing.txt');
        } catch (error: any) {
            expect(error.message).toBe('File is not found');
        }
    });

})