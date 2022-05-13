#!/usr/local/bin/python3.10
import os, sys, re, cgi, cgitb, json, io, subprocess
from subprocess import PIPE


cgitb.enable()

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print("Content-Type: application/json; charset=utf-8\n")
print()
form = cgi.FieldStorage()

result = {"nira-bot":None,"nira-net":None}

code = subprocess.run(["systemctl", "status", "nira"], stdout=PIPE, stderr=PIPE)
if code.returncode == 0:
    result["niraBot"] = "<span style='color: #42ff8e; font-weight: bold;'>○</span> 動作中"
else:
    result["niraBot"] = "<span style='color: #ff4d6b; font-weight: bold;'>×</span> 不具合あり"

code = subprocess.run(["systemctl", "status", "apache2"], stdout=PIPE, stderr=PIPE)
if code.returncode == 0:
    result["niraNet"] = "<span style='color: #42ff8e; font-weight: bold;'>○</span> 動作中"
else:
    result["niraNet"] = "<span style='color: #ff4d6b; font-weight: bold;'>×</span> 不具合あり"


print(json.dumps(result))
