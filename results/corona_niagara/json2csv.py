import pandas as pd
df = pd.read_json (r'C:\Users\Ji\Dropbox\COSC 3P99\results\corona_niagara\userprofiles_test.json')
df.to_csv (r'C:\Users\Ji\Dropbox\COSC 3P99\results\corona_niagara\userprofiles_test.csv', index = None)