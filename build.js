const exe = require('@angablue/exe');

const build = exe({
    entry: './index.js',
    out: './build/VodDownloader.exe',
    version: '1.2.0',
    target: 'latest-win-x64',
    icon: './assets/icon.ico',
    properties: {
        FileDescription: 'Download Twitch Vod\'s',
        ProductName: 'VodDownloader',
        LegalCopyright: "Open source 'Hrodvitnir-Fenrir'",
        OriginalFilename: 'VodDownloader.exe'
    }
});

build.then(() => console.log('Build completed!'));