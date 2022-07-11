import requests
import json

print("请输入文本：")
text = input()
json = {"text": text}
r = requests.post("https://paste.lli.cx/creat-api", json=json)
print("地址：")
print("https://paste.lli.cx/"+r.json()["id"])
