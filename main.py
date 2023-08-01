from iqoptionapi.stable_api import IQ_Option
from time import time
import json

email = 'coddeedev@gmail.com'
password = 'Jsati27l81'

api = IQ_Option(email, password)

status, reason = api.connect()

if status == False:
  print('error:', reason)

api.change_balance('PRACTICE')

all_assets = api.get_all_open_time()['digital']

assets = []

for key, value in all_assets.items():
  if value['open']:
    assets.append(key)

results = {}

for asset in assets:
  results[asset] = api.get_candles(asset, 60, 130, time())

print(json.dumps(results))
