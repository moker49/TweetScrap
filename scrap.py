from dotenv import load_dotenv
from lxml import html
import json
import os
import requests
import time
load_dotenv()
COOLDOWN = int(os.getenv('COOLDOWN'))

print("Scraping running...")
while (True):
    page = requests.get(
        'https://mentalmars.com/game-news/borderlands-3-golden-keys/')
    tree = html.fromstring(page.content)

    reward = tree.xpath(
        '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[1]/strong/text()')[0]
    expire_date = tree.xpath(
        '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[2]/text()')[0]
    key = tree.xpath(
        '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[3]/code/text()')[0]

    last = {}
    with open("last.json") as json_file:
        last = json.load(json_file)

    if last["key"] != key:
        last["expire_date"] = expire_date
        last["key"] = key
        last["status"] = "pending"
        with open("last.json", "w") as json_file:
            json.dump(last, json_file, indent=4)
        print("key updated")

    time.sleep(COOLDOWN)
