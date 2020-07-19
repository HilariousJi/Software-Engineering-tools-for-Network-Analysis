from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

import tweepy
import csv
import json

# User credentials from your twitter app
access_token = "414090496-yjHEuc8BKwLcz98ObOj8wlosOvDAFCSviqJgB4J1"
access_token_secret = "GwAzYkTbp0XFQvzryTMjVfbkflTxe72vfPySC6d0P7oJO"
consumer_key = "j7eIFyUuRB2OQ3DrYH10KIQx6"
consumer_secret = "9bqKFwjvJfWjJbnvIVcb4qgyDzLx44CLlYDGkFXl5oZ0UvLfMu"


auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, wait_on_rate_limit=True)
csvFile = open('tweepy_results.csv', 'a')
csvWriter = csv.writer(csvFile)
query = "coronavirus"
language = "en"
geolocation = "43.1594,-79.2469,50km"
results = api.search(q=query, lang=language, geocode=geolocation)
for tweet in results:
    print(tweet.user.screen_name)
    print("#############")
    followers = api.followers(tweet.user.screen_name)
    for f in followers:
        print(f.screen_name)
    print("#############")
    csvWriter.writerow(
        [tweet.created_at, tweet.text.encode('utf-8'), tweet.user.id])


# To get a list of available woeid's use the code below
#trends_available = api.trends_available()
#print(json.dumps(trends_available, indent=4))
