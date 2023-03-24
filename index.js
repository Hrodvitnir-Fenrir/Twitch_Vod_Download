const readline = require('readline');
const { exec } = require('child_process');
const axios = require("axios");
const ora = require('ora');
const fs = require("fs");
fs.mkdirSync('downloads', { recursive: true });
const list = fs.createWriteStream("downloads/list.txt", {
    flags: "a"
});

const regex = /[a-z0-9]+_[a-z0-9]+_[a-z0-9]+_[a-z0-9]+/;
let dlLink;
let i = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askUrl() {
    rl.question('Enter the URL of the VOD to download: ', async (url) => {
        let match = url.match(regex);
        if (match) {
            dlLink = `https://dgeft87wbj63p.cloudfront.net/${match[0]}/chunked/`;
            console.clear();
            console.log(`VOD Url:\n${dlLink}`);
            await oldDlChunk();
        } else {
            console.log("Invalid URL");
            askUrl();
        }
    });
}

askUrl();

async function oldDlChunk() {
    try {
        console.clear();
        console.log("VOD Url: " + dlLink);
        console.log("Actual time of the VOD: " + formatTime(i));
        const spinner = ora({
            spinner: "simpleDotsScrolling",
            color: "blue",
            text: `Downloading chunk ${i}`
        }).start();
        const response = await axios.get(`${dlLink}${i}.ts`, { responseType: "stream" });
        const writer = fs.createWriteStream(`downloads/${i}.ts`);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        await list.write(`file '${i}.ts' \n`);
        spinner.succeed(`Downloaded chunk ${i}`);
        i++;
        await oldDlChunk();
    } catch (error) {
        console.clear();
        console.log("VOD Url: " + dlLink);
        console.log("Actual time of the VOD: " + formatTime(i));
        console.log(`All downloads are done, total: ${i} chunk`);
        console.log("Concat all part...")
        ffmpegConcat();
    }
}

async function ffmpegConcat() {
    return new Promise((resolve, reject) => {
        exec(
            "ffmpeg -f concat -safe 0 -i downloads/list.txt -c copy Vod.mp4",
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error concatenating files with ffmpeg: ${error}`);
                    reject(error);
                }
                // console.log(`ffmpeg stdout: ${stdout}`);
                console.log(`ffmpeg stderr: ${stderr}`);
                console.clear();
                console.log("Concatenation finished");
                resolve();
                console.log("Deleting temp folder...");
                list.close();
                setTimeout(() => {
                    fs.rm("./downloads", { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("temp folder deleted successfully");
                            console.log(`Your \"Vod.mp4\" is available \nTime: ~${formatTime(i)}\n${i} Chunk`);
                        }
                    });
                }, 5000);
            }
        );
    });
}

function formatTime(numChunks) {
    const totalSeconds = numChunks * 10;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}