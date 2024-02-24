const readline = require('readline');
const { exec } = require('child_process');
const axios = require("axios");
const fs = require("fs");
const Spinnies = require("spinnies");
fs.mkdirSync('downloads', { recursive: true });
const list = fs.createWriteStream("downloads/list.txt", {
    flags: "a"
});

const regex = /[a-z0-9]+_[a-z0-9]+_[a-z0-9]+_[a-z0-9]+/;
let dlLink;
let i = 0;
let stop = false;
let instance = 0;

const infoSpin = new Spinnies({ disableSpins: true });
const chunkSpin = new Spinnies();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askUrl() {
    rl.question('Enter the URL of the VOD to download: ', async (url) => {
        let match = url.match(regex);
        if (match) {
            dlLink = `https://dgeft87wbj63p.cloudfront.net/${match[0]}/chunked/`;
            infoSpin.add("url", { text: `🔗 Vod url: ${dlLink}` });
            infoSpin.add("time", { text: `🕓 Actual time of the VOD: ${formatTime(i)}` });
            await limiter();
        } else {
            console.log("Invalid URL");
            askUrl();
        }
    });
}

askUrl();

async function limiter() {
    if (i == 0) {
        dlChunk(i);
        i++;
        dlChunk(i);
        i++;
        dlChunk(i);
    } else if (!stop && i != 0) {
        console.clear();
        infoSpin.update("time", { text: `🕓 Actual time of the VOD: ${formatTime(i)}` });
        i++;
        dlChunk(i);
    } else if (stop) {
        console.log("stop");
        chunkSpin.stopAll('stopped');
        console.log("Download compleate\nConcatenate all part...");
        setTimeout(() => {
            ffmpegConcat();
        }, 5000);
    }
}

async function updateVisual() {

}

async function dlChunk(j) {
    try {
        chunkSpin.add(`chunk${j}`, { text: `Downloading chunk ${j} ...` });
        await list.write(`file '${j}.ts' \n`);
        const response = await axios.get(`${dlLink}${j}.ts`, { responseType: "stream" });
        const writer = fs.createWriteStream(`downloads/${j}.ts`);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        await instance--;
        await chunkSpin.remove(`chunk${j}`);
        limiter();
    } catch (error) {
        console.log(error)
        stop = true;
    }
}

function formatTime(numChunks) {
    const totalSeconds = numChunks * 10;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function ffmpegConcat() {
    return new Promise((resolve, reject) => {
        exec(
            `ffmpeg -f concat -safe 0 -i downloads/list.txt -c copy Vod-${dlLink.match(regex)}.mp4`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error concatenating files with ffmpeg: ${error}`);
                    reject(error);
                }
                // console.log(`ffmpeg stdout: ${stdout}`);
                // console.log(`ffmpeg stderr: ${stderr}`);
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
                            console.clear()
                            console.log("Temp folder deleted successfully");
                            console.log(`Your \"Vod.mp4\" is available \nTime: ~ ${formatTime(i)}\n${i} Chunk`);
                        }
                    });
                }, 5000);
            }
        );
    });
}


