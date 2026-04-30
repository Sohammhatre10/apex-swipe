import pymongo
client = pymongo.MongoClient("mongodb+srv://sohammhatre420_db_user:MY2jFa17pYoaNJKW@cluster0.n16i0yc.mongodb.net/?appName=Cluster0")
db = client.apexswipe
doc = db.stocks.find_one()
print(doc)
