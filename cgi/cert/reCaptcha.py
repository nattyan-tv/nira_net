#!/usr/local/bin/python3.10
import cgi
import os
import sys
import json
import io
import cgitb
import traceback
from urllib import response
import requests
from auth_data import SECRET

cgitb.enable()
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
print("Content-Type: text/html; charset=utf-8\n")
print()
form = cgi.FieldStorage()

def endpoint(SecretKey, Response):
    return f"https://www.google.com/recaptcha/api/siteverify?secret={SecretKey}&response={Response}"

RESPONSE = None
if "g-recaptcha-response" in form:
    RESPONSE = form["g-recaptcha-response"].value
    URL = endpoint(SECRET, RESPONSE)
    response = requests.post(URL,headers={'content-type': 'application/x-www-form-urlencoded'})
    CONTENT = response.json()
    if CONTENT["success"] == True:
        print("認証成功だよ！")
    else:
        print("認証失敗だよ！")
else:
    print("No response")
