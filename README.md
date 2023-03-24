# Twitch VOD Downloader

This is a command-line tool to download Twitch VODs, including sub-only VODs.

## How to use
1. Download the latest version of `VodDownloader.exe` from the [releases page](https://github.com/Hrodvitnir-Fenrir/Twitch_Vod_Download/releases).
2. Go to the [Twitch](https://www.twitch.tv/) page of the streamer whose VOD you want to download.
3. Copy the link of the image associated with the VOD from the "Videos" tab.
4. Paste the link into the `VodDownloader.exe` software.

### Known issues

- `VodDownloader.exe` may be detected as a virus, but it is not.[^1]
- On Windows 10, it is not recommended to run `VodDownloader.exe` directly, as it may pause. It is therefore preferable to launch it with the Windows Terminal.
- There may be a few seconds missing at the end of the VOD.
- The VOD may not be fully downloaded.
- `VodDownloader.exe` does not have an icon.[^1]

[^1]: This issue is plain to be fix. The others do not depend of me.

## Bonus feature

`VodDownloader.exe` also allows you to download sub-only VODs.