#!/usr/local/bin/python3.10
import pickle
import requests
import cgi
import os
import sys
import io
import cgitb
import traceback
import auth_data
cgitb.enable()

API_ENDPOINT = auth_data.API_ENDPOINT
CLIENT_ID = auth_data.CLIENT_ID
CLIENT_SECRET = auth_data.CLIENT_SECRET
REDIRECT_URI = 'https://nira.f5.si/cgi/discord_auth/mc_server.py'

code = ""
form = cgi.FieldStorage()
nira_bot_dir = "/home/nattyantv/nira_bot_rewrite"
token = ""

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print("Content-Type: text/html; charset=utf-8\n")
print()
print("""
<html>
<title>NIRA Web</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-title" content="NIRA Web">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">

<link rel="shortcut icon" href="../icon.ico" type="image/vnd.microsoft.icon">
<link rel="apple-touch-icon" href="../icon.png">
<meta name="description" content="AppBase network">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
<style>
.shell{
    font-family: 'Roboto Mono', monospace;
}
</style>
<body>""")

def exchange_code(code):
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers)
    r.raise_for_status()
    return r.json()

def refresh_token(refresh_token):
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers)
    r.raise_for_status()
    return r.json()

def get_guilds(access_token):
    headers = {
        'Authorization': 'Bearer ' + access_token
    }
    r = requests.get('%s/users/@me/guilds' % API_ENDPOINT, headers=headers)
    r.raise_for_status()
    data = r.json()
    guilds = []
    for i in range(len(data)):
        guilds.append(data[i]["id"])
    return guilds

def main():
    if "code" not in form:
        print("DiscordAuthからログインしてください。")
        return
    token = ""
    try:
        token = exchange_code(form["code"].value)["access_token"]
        guild = get_guilds(token)
    except requests.exceptions.HTTPError as err:
        print("DiscordAuthに接続できませんでした。<br>再度ログインしなおしてください。<br>")
        print(traceback.format_exc())
        print(f"<br>code:{form['code'].value}<br>token:{token}")
        return
    with open(f"{nira_bot_dir}/mc_server_list.nira","rb") as f:
        mc_list = pickle.load(f)
    mc_list_keys = list(mc_list.keys())
    key_i = 0
    url = ""
    for i in range(len(guild)):
        if int(guild[i]) not in mc_list_keys:
            continue
        for i in range(int((len(mc_list[mc_list_keys[key_i]])-1)/2)+1):
            # {mc_list[mc_list_keys[key_i]][f'{i+1}_ad'][0]}
            # [mc_name]=[java/be]=[address:port]
            url = url + f"{mc_list[mc_list_keys[key_i]][i+1][0]}={mc_list[mc_list_keys[key_i]][i+1][2]}={mc_list[mc_list_keys[key_i]][i+1][1]}?"
        key_i = key_i + 1
    url = url[:-1]
    print(f"""
    <script>
        sessionStorage.setItem("guilds", "{guild}")
        data = localStorage.getItem("mc_list")
    """ + """
        if (data == null) {
    """ + f"""
        data = "{url}"
    """ + """
        }
        else
        {
    """ + f"""
            data = data + "?{url}"
        """ + """
        }
        console.log(data);
        localStorage.setItem("mc_list", data);
        location.replace("/index.html");
    </script>
    """)


main()

# main()
print("</body></html>")
