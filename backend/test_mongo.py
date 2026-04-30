import pymongo
client = pymongo.MongoClient("<MONGODB_URI>")
db = client.apexswipe
doc = db.stocks.find_one()
print(doc)
