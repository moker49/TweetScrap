from lxml import html
import requests


page = requests.get(
    'https://mentalmars.com/game-news/borderlands-3-golden-keys/')
tree = html.fromstring(page.content)

test = tree.xpath(
    '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[3]')

reward = tree.xpath(
    '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[1]/strong/text()')
expire_date = tree.xpath(
    '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[2]/text()')
last_key = tree.xpath(
    '//*[@id="gp-content"]/article/div[5]/figure[1]/table/tbody/tr[1]/td[3]/code/text()')


print(reward)
print(expire_date)
print(last_key)
