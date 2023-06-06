# Twitch VOD Downloader

This is a command-line tool to download Twitch VODs, including sub-only VODs.

# Requirements
You need to have install FFMPEG on your computer for concat the vod: [easy tutorial](https://www.wikihow.com/Install-FFmpeg-on-Windows)

## How to use
1. Download the latest version of `VodDownloader.exe` from the [releases page](https://github.com/Hrodvitnir-Fenrir/Twitch_Vod_Download/releases).
2. Go to the [Twitch](https://www.twitch.tv/) page of the streamer whose VOD you want to download.
3. Copy the link of the image associated with the VOD from the "Videos" tab.
4. Paste the link into the `VodDownloader.exe` software.

## Known issues [^1]

- `VodDownloader.exe` may be detected as a virus, but it is not. (If you not trust, clone the repo and use .js and not the .exe)
- On Windows 10, it is not recommended to run `VodDownloader.exe` directly, as it may pause. It is therefore preferable to launch it with the Windows Terminal.
- There may be a few seconds missing at the end of the VOD.
- On some VOD, they are not fully downloaded.

[^1]: This issues not really depend of me, not plain to fix it atm.

### Bonus feature

`VodDownloader.exe` also allows you to download sub-only VODs.