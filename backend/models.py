from mongoengine import Document, StringField, FloatField, ReferenceField, URLField, EmailField

class Restaurant(Document):
    restaurantName = StringField(required=True)
    address = StringField()  # Not required for Step 1
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    cuisine = StringField()
    bankName = StringField()  # Added for Step 3
    accountNumber = StringField()  # Added for Step 3
    
    meta = {
        'collection': 'restaurants',
        'indexes': [
            {'fields': ['email'], 'unique': True}
        ]
    }

class Product(Document):
    restaurant = ReferenceField(Restaurant, required=True)
    name = StringField(required=True, max_length=100)
    category = StringField(required=True, max_length=100)
    description = StringField(max_length=300)
    price = FloatField(required=True)
    image = URLField()

    meta = {
        'collection': 'products'
    }
