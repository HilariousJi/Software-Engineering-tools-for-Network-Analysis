import twint

c = twint.Config()
c.Near = "St. Catharines"
c.Search = "coronavirus OR COVID-19 OR cough OR fever"
c.Store_object = True
#c.Hide_output = True
twint.run.Search(c)
tweets = twint.output.tweets_list
with open('tweets_location_test.csv', 'w') as output:
    for t in tweets:
        output.write('{},{}\n'.format(t.username, t.near))
