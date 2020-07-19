import tweepy
access_token = "414090496-yjHEuc8BKwLcz98ObOj8wlosOvDAFCSviqJgB4J1"
access_token_secret = "GwAzYkTbp0XFQvzryTMjVfbkflTxe72vfPySC6d0P7oJO"
consumer_key = "j7eIFyUuRB2OQ3DrYH10KIQx6"
consumer_secret = "9bqKFwjvJfWjJbnvIVcb4qgyDzLx44CLlYDGkFXl5oZ0UvLfMu"


auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, wait_on_rate_limit=True)


class MyStreamListener(tweepy.StreamListener):
    def on_status(self, status):
        print(status.text)


myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)

myStream.filter(track=['python'], is_async=True)
