from dotenv import load_dotenv
from lxml import html
import json
import os
import re
import time
load_dotenv()
COOLDOWN = int(int(os.getenv('COOLDOWN'))/2)

print("Scraping running...")
while (True):
    with open("html.html", encoding='utf-8') as html_file:
        html_str = html_file.read()
    tree = html.fromstring(html_str)

    pre_xpath = '/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/div[3]/div/div/section/div/div/div/div/'
    post_xpath = '/div/div/article/div/div/div[2]/div[2]/div[2]/div/span/text()'
    expire_xpath = '/div/div/article/div/div/div[2]/div[2]/div[2]/div/span[2]/text()'

    potential_new_keys = {}
    i = 1
    while (len(potential_new_keys) < 10 and i < 100):
        expire_string = tree.xpath(f'{pre_xpath}div[{i}]{expire_xpath}')
        if (expire_string and 'Expire' in expire_string[0]):
            code = (tree.xpath(f'{pre_xpath}div[{i}]{post_xpath}')
                    [0]).split('SHiFT code for')[1].replace('free', '').replace('\n\n', '\n').strip()

            message = code.split(':')[0]
            key = re.findall(r'(\w+-\w+-\w+-\w+-\w+)', code)[0]
            expire = (expire_string[0]).split('.')[1].strip()
            status = 'pending'

            potential_new_keys.update({key: [message, expire, status]})
        i = i + 1

    all_keys = {}
    with open("all_keys.json") as json_file:
        all_keys = json.load(json_file)

    for key, value in potential_new_keys.items():
        if key not in all_keys:
            all_keys.update({key: value})

    with open("all_keys.json", "w") as json_file:
        json.dump(all_keys, json_file, indent=4)

    try:
        os.remove('html.html')
    except (FileNotFoundError):
        pass

    time.sleep(COOLDOWN)
