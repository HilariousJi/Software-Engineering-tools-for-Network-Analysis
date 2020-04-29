import twint
import datetime

st = datetime.datetime.now().timestamp()
print("Starting at: "+str(st))
c = twint.Config()
c.Near = "St. Catharines"
c.Search = "coronavirus OR COVID-19 OR cough OR fever"
c.Store_object = True
c.Hide_output = True
twint.run.Search(c)
tweets = twint.output.tweets_list
#users = twint.output.users_list
#userList = []
#userFollowing = []
#finalList = []
userSet = []
with open('tweets_location_test.csv', 'w') as output:
    for tw in tweets:
        userSet.append(tw.username)
    userSet = list(dict.fromkeys(userSet))
    for us in userSet:
        output.write('{}\n'.format(us))
    for u in userSet:
        c.Limit = 60
        c.Username = u
        twint.run.Followers(c)
        userFollowing = twint.output.users_list
        for f in userFollowing:
            output.write('{},{}\n'.format(u, f))
    #output.write('{},{}\n'.format(t.username, t.near))
et = datetime.datetime.now().timestamp()
print("Finished at: "+str(et))
