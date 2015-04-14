# this file utilizes twitters real-time streaming api to gather tweets that
# contain bitcamp (the name of the event this was used for), twifr, or my name nisarga
from twython import Twython
from twython import TwythonStreamer
import requests
APP_KEY = 'n95GkESGweTQ7g3CvPgOJkhvp'
APP_SECRET = 'Liaxutu48kXlXknubCgRLdkyVS3Ry37XkT8KCy4qKqKuybn35y'

twitter = Twython(APP_KEY, APP_SECRET)

auth = twitter.get_authentication_tokens()
OAUTH_TOKEN = auth['oauth_token']
OAUTH_TOKEN_SECRET = auth['oauth_token_secret']



print(auth['auth_url'])

pin = input()

twitter = Twython(APP_KEY, APP_SECRET,
                  OAUTH_TOKEN, OAUTH_TOKEN_SECRET)

final_step = twitter.get_authorized_tokens(pin)

OAUTH_TOKEN = final_step['oauth_token']
OAUTH_TOKEN_SECRET = final_step['oauth_token_secret']

arr = []

class MyStreamer(TwythonStreamer):
    def on_success(self, data):

        if "user" in data:

            tmp = {data["user"]["screen_name"]:(data["user"]["profile_image_url"].replace("_normal", ""))}
            print(tmp)
            if tmp not in arr:
                arr.append(tmp)
                payload = {'img': str(data["user"]["profile_image_url"]).replace("_normal", ""), 'id': str(data["user"]["screen_name"])}
                r = requests.get("http://twitterfr.azurewebsites.net/enroll", params=payload)
                print(r.url)
    def on_error(self, status_code, data):
        print(status_code)


stream = MyStreamer(APP_KEY, APP_SECRET,
                    OAUTH_TOKEN, OAUTH_TOKEN_SECRET)

stream.statuses.filter(track='twifr,bitcamp,nisarga')