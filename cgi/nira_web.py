#!/usr/local/bin/python3.10
import cgi
import cgitb
import os, json, random
import subprocess
from subprocess import PIPE
import sys, io
import traceback
import a2s
from mcstatus import MinecraftBedrockServer as mcb, MinecraftServer as mc
cgitb.enable()

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print("Content-Type: text/html; charset=utf-8\n")
print()
form = cgi.FieldStorage()

ack = 1




if "address" not in form or "port" not in form or "type" not in form:
    ack = 0
else:
    ack = int(form["type"].value)



STEAM = 1
MINECRAFT = 2

JAVA = 1
BE = 2


if ack == MINECRAFT and "server_type" not in form:
    ack = 0


def main():
    if ack == 0:
        print(f"Bad Request - 400\n正常なデータが送信されませんでした。\nACK:{ack}/{form['server_type'].value}")
    elif ack == STEAM:
        
        adr = form["address"].value
        port = int(form["port"].value)
        
        
        try:
            info = a2s.info((adr,port))
            user = a2s.players((adr,port))
        except BaseException as err:
            print(f"Service Unavailable - 503\nSteamサーバーに接続できませんでした。\n{str(err)}")
            return
        data = {}
        data["CODE"] = 200
        data["TITLE"] = "OK"
        data["DESCRIPTION"] = "正常に通信が出来ました。"
        data["SERVER_NAME"] = str(info.server_name)
        data["SERVER_MAP"] = str(info.map_name)
        players = []
        player = 0
        if len(user) == 0:
            data["SERVER_PLAYER"] = str(f"0/{info.max_players}人")
            data["SERVER_PLAYERS"] = "現在オンラインのプレイヤーはいません。"
        else:
            for i in range(len(user)):
                if user[i].name == "":
                    continue
                user_time = int(user[i].duration/60)
                if user_time > 60:
                    user_time = f"{int(user_time // 60)}時間{int(user_time % 60)}"
                player = player + 1
                players.append(f"ユーザー名:{user[i].name}\n時間:{user_time}分{round(user[i].duration%60)}秒")
        if player == 0:
            data["SERVER_PLAYER"] = str(f"0/{info.max_players}人")
            data["SERVER_PLAYERS"] = "現在オンラインのプレイヤーはいません。"
        else:
            data["SERVER_PLAYER"] = str(f"{player}/{info.max_players}人")
            data["SERVER_PLAYERS"] = str("\n\n".join(players))
        print(f"""\
正常に通信できました。
サーバー名:{str(info.server_name)}
マップ名:{str(info.map_name)}

プレイヤー数:{data["SERVER_PLAYER"]}

{data["SERVER_PLAYERS"]}""")
        return
    elif ack == MINECRAFT:
        adr = f"{form['address'].value}:{form['port'].value}"
        if form["server_type"].value == "java":
            server_type = JAVA
        elif form["server_type"].value == "be":
            server_type = BE
        else:
            print(f"Internal Server Error - 500\nサーバータイプが不正です。\n{form['server_type'].value}")
            return
        if server_type == JAVA:
            try:
                server = mc.lookup(adr)
                status = server.status()
            except BaseException as err:
                print(f"Service Unavailable - 503\nMinecraft Javaサーバーに接続できませんでした。\n{str(err)}")
                return
            data = {}
            data["CODE"] = 200
            data["TITLE"] = "OK"
            data["DESCRIPTION"] = "正常に通信が出来ました。"
            data["SERVER_PING"] = int(status.latency)
            data["SERVER_PLAYERS"] = status.players.online
            data["SERVER_DESCRIPTION"] = status.description
            if "sample" in status.raw["players"]:
                if int(status.players.online) != 0:
                    data["SERVER_PLAYERS"] = "\n".join([i['name'] for i in status.raw['players']['sample']])
                else:
                    data["SERVER_PLAYERS"] = ""
            else:
                data["SERVER_PLAYERS"] = ""
            print(f"""\
正常に通信できました。
{status.description}

{status.players.online}人オンライン

{data["SERVER_PLAYERS"]}""")
        elif server_type == BE:
            try:
                server = mcb.lookup(adr)
                status = server.status()
            except BaseException as err:
                print(f"Service Unavailable - 503\nMinecraft Bedrockサーバーに接続できませんでした。\n{str(err)}")
                return
            ping = int(status.latency)
            gamemode = status.gamemode
            players = status.players_online
            name = status.motd
            if ping == 0:
                print(f"""\
正常に通信できました。
{name}
ゲームモード:{gamemode}

{players}人オンライン""")
            else:
                print(f"""\
正常に通信できました。
{name}
ゲームモード:{gamemode}

{players}人オンライン

Ping:{ping}ms""")
            return
        else:
            print(f"Bad Request - 400\n正常なデータが送信されませんでした。\nACK:{ack}")
            return
        return
    return

main()
