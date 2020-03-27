import twint

c = twint.Config()
c.Search = "twint_test"
c.Store_object = True
c.User_full = True
#c.Hide_output = True
twint.run.Search(c)
tweets = twint.output.tweets_list
for t in tweets:
    for u in t.username:
        c = twint.Config()
        c.Username = u
        twint.run.Followers(c)
        target_followers = twint.output.users_list
        with open('followers.csv', 'w') as output:
            output.write('id,username,followers,following\n')
            for f in target_followers:
                output.write('{},{},{},{}\n'.format(
                    f.id, f.username, f.followers, f.following))