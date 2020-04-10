import pandas as pd

df = pd.read_csv('niagara_corona.csv')
ids = df.user_id
names = df.username
print(ids)
print(names)
userDict = []
for i in range(len(ids)):
    userDict.append({"uid": ids[i], "username": names[i]})
userList = list({v["uid"]: v for v in userDict}.values())
print(userList)
with open('parsed.csv', 'w') as output:
    for u in userList:
        output.write('{},{}\n'.format(u["uid"], u["username"]))
