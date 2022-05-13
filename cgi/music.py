#!/usr/local/bin/python3.10
import os, sys, re, cgi, cgitb, json, io
import youtube_dl
import niconico_dl

cgitb.enable()

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print("Content-Type: application/json; charset=utf-8\n")
print()
form = cgi.FieldStorage()

def getUrl(url):
    if siteTypeCheck(url) == "yt":
        if not playlistCheck(url):
            with youtube_dl.YoutubeDL(dict(forceurl=True, quiet=True)) as ydl:
                r = ydl.extract_info(url, download=False)
                media_url = r['formats'][-1]['url']
                return media_url
        else:
            return (None, "PLAYLIST_ERROR")
    elif siteTypeCheck(url) == "nc":
        if not playlistCheck(url):
            with niconico_dl.NicoNicoVideo(url) as nico:
                media_url = nico.get_download_link()
                return media_url
        else:
            return (None, "PLAYLIST_ERROR")
    else:
        return (None, "SITE_ERROR")

def playlistCheck(url):
    if re.search("playlist", url) or re.search("mylist", url):
        return True
    else:
        return False


def siteTypeCheck(url):
    if re.search("nicovideo.jp", url) or re.search("nico.ms", url):
        return "nc"
    elif re.search("youtube.com", url) or re.search("youtu.be", url):
        return "yt"
    else:
        return None


if "url" not in form:
    print(json.dumps({"CODE":400, "TITLE":"Bad Request", "DESCRIPTION":"正常なデータが送信されませんでした。", "URL":""}))
else:
    media_url = getUrl(form["url"].value)
    if type(media_url) == tuple:
        if media_url[1] == "SITE_ERROR":
            print(json.dumps({"CODE":400, "TITLE":"Bad Request", "DESCRIPTION":"そのサイトは非対応です。", "URL":""}))
        elif media_url[1] == "PLAYLIST_ERROR":
            print(json.dumps({"CODE":400, "TITLE":"Bad Request", "DESCRIPTION":"プレイリストは非対応です。", "URL":""}))
    else:
        print(json.dumps({"CODE":200, "TITLE":"OK", "DESCRIPTION":"正常に通信が出来ました。", "URL":media_url}))
