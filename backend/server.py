from flask import Flask, jsonify, request, g, send_from_directory, url_for
from flask_cors import CORS
from dotenv import load_dotenv
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import os
from datetime import datetime, timedelta, timezone 
from mongoengine import connect

from auth import authenticate_token
from models import Restaurant, Product  # Import models

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Connect to MongoDB using MongoEngine
MONGO_URI = os.getenv("MONGO_URI")
connect(host=MONGO_URI, db='Dine-Dash-Database')

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Set the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.before_request
def before_request():
    """Authenticate token and set global restaurant context."""
    decoded_token, restaurant_id = authenticate_token(request)
    g.restaurant = (decoded_token, restaurant_id)

@app.route("/")
def hello():
    return jsonify({"data": "hello"})

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': True, 'message': 'Invalid JSON format'}), 400

        restaurantName = data.get('restaurantName')
        email = data.get('email')
        password = data.get('password')
        address = data.get('address')
        cuisine = data.get('cuisine')

        # Validate required fields
        if not restaurantName:
            return jsonify({'error': True, 'message': 'Restaurant Name is required'}), 400
        if not email:
            return jsonify({'error': True, 'message': 'Email is required'}), 400
        if not password:
            return jsonify({'error': True, 'message': 'Password is required'}), 400
        if not address:
            return jsonify({'error': True, 'message': 'Address is required'}), 400
        if not cuisine:
            return jsonify({'error': True, 'message': 'Cuisine is required'}), 400

        # Check if the restaurant already exists
        if Restaurant.objects(email=email).first():
            return jsonify({'error': True, 'message': 'Restaurant already exists'}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create new restaurant
        new_restaurant = Restaurant(
            restaurantName=restaurantName,
            email=email,
            password=hashed_password,
            address=address,
            cuisine=cuisine
        )
        new_restaurant.save()

        # Generate JWT token
        token = jwt.encode({
            'restaurant': {'id': str(new_restaurant.id), 'email': email},
            'exp': datetime.utcnow() + timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'error': False,
            'message': 'Registration Successful.',
            'accessToken': token
        }), 201

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': True, 'message': 'Invalid JSON format'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email:
            return jsonify({'error': True, 'message': 'Email is required'}), 400
        if not password:
            return jsonify({'error': True, 'message': 'Password is required'}), 400

        restaurant = Restaurant.objects(email=email).first()
        if not restaurant:
            return jsonify({'error': True, 'message': 'Restaurant not found'}), 404

        if check_password_hash(restaurant.password, password):
            access_token = jwt.encode({
                'restaurant': {
                    'id': str(restaurant.id),
                    'restaurantName': restaurant.restaurantName,
                    'email': email
                },
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }, app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({
                'error': False,
                'message': 'Login Successful',
                'email': email,
                'accessToken': access_token
            }), 200
        else:
            return jsonify({'error': True, 'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500

@app.route('/get-restaurant', methods=['GET'])
def get_restaurant():
    try:
        decoded_token, restaurant_id = authenticate_token(request)
        if not restaurant_id:
            return jsonify({'error': True, 'message': 'Restaurant ID not found in token'}), 401

        restaurant_id = decoded_token.get('restaurant', {}).get('id')
        if not restaurant_id:
            return jsonify({'error': True, 'message': 'Restaurant ID not found in token'}), 400

        restaurant = Restaurant.objects(id=ObjectId(restaurant_id)).first()
        if not restaurant:
            return jsonify({'error': True, 'message': 'Restaurant not found'}), 404

        restaurant_data = {
            'id': str(restaurant.id),
            'restaurantName': restaurant.restaurantName,
            'email': restaurant.email,
            'address': restaurant.address
        }

        return jsonify({'error': False, 'restaurant': restaurant_data}), 200

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500
    
@app.route('/get-products', methods=['GET'])
def get_all_products():
    try:
        decoded_token, restaurant_id = authenticate_token(request)
        if not restaurant_id:
            return jsonify({'error': True, 'message': 'Restaurant ID not found in token'}), 401

        restaurant = Restaurant.objects(id=ObjectId(restaurant_id)).first()
        if not restaurant:
            return jsonify({'error': True, 'message': 'Restaurant not found'}), 404

        # Get all products for the restaurant
        products = Product.objects(restaurant=restaurant)

        # Convert products to a list of dictionaries
        products_list = [{
            'id': str(product.id),
            'name': product.name,
            'category': product.category,
            'description': product.description,
            'price': product.price,
            'image': product.image
        } for product in products]

        return jsonify({'error': False, 'products': products_list}), 200

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500

@app.route('/add-product', methods=['POST'])
def add_product():
    try:
        # Check for image file in the request
        if 'image' not in request.files:
            return jsonify({'error': True, 'message': 'Image file is missing'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': True, 'message': 'No image selected for uploading'}), 400

        # Secure and save the image file
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)

            # Generate a URL for the uploaded image
            image_url = url_for('uploaded_file', filename=filename, _external=True)

        # Retrieve other form data
        name = request.form.get('name')
        category = request.form.get('category')
        description = request.form.get('description')
        price = float(request.form.get('price', 0.0))

        # Validate the inputs
        if not name:
            return jsonify({'error': True, 'message': 'Product Name is required'}), 400
        if not category:
            return jsonify({'error': True, 'message': 'Category is required'}), 400
        if price is None:
            return jsonify({'error': True, 'message': 'Price is required'}), 400

        # Authenticate the user
        decoded_token, restaurant_id = authenticate_token(request)
        if not restaurant_id:
            return jsonify({'error': True, 'message': 'Restaurant ID not found in token'}), 401

        restaurant = Restaurant.objects(id=ObjectId(restaurant_id)).first()
        if not restaurant:
            return jsonify({'error': True, 'message': 'Restaurant not found'}), 404

        # Save the product with the image URL
        new_product = Product(
            restaurant=restaurant,
            name=name,
            category=category,
            description=description,
            price=price,
            image=image_url  # Use the generated image URL
        )
        new_product.save()

        # Convert ObjectId to string for JSON response
        product_data = {
            'id': str(new_product.id),
            'name': new_product.name,
            'category': new_product.category,
            'description': new_product.description,
            'price': new_product.price,
            'image': new_product.image
        }

        return jsonify({
            'error': False,
            'product': product_data,
            'message': 'Product Added Successfully'
        }), 201

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/edit-product/<product_id>/', methods=['PUT'])
def edit_product(product_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': True, 'message': 'Invalid JSON format'}), 400

        updated_name = data.get('name')
        updated_category = data.get('category')
        updated_description = data.get('description')
        updated_price = data.get('price')
        updated_image = data.get('image')

        # Ensure image is a string
        if isinstance(updated_image, list):
            return jsonify({'error': True, 'message': 'Image field must be a string'}), 400

        update_fields = {}
        if updated_name:
            update_fields['name'] = updated_name
        if updated_category:
            update_fields['category'] = updated_category
        if updated_description:
            update_fields['description'] = updated_description
        if updated_price is not None:
            update_fields['price'] = updated_price
        if updated_image:
            update_fields['image'] = updated_image

        if not update_fields:
            return jsonify({'error': True, 'message': 'No fields to update'}), 400

        # Update the product
        result = Product.objects(id=ObjectId(product_id)).update(**update_fields)

        if result == 0:
            return jsonify({'error': True, 'message': 'Product not found'}), 404

        # Retrieve the updated product
        updated_product = Product.objects(id=ObjectId(product_id)).first()
        if not updated_product:
            return jsonify({'error': True, 'message': 'Product not found after update'}), 404

        product_data = {
            'id': str(updated_product.id),
            'name': updated_product.name,
            'category': updated_product.category,
            'description': updated_product.description,
            'price': updated_product.price,
            'image': updated_product.image
        }

        return jsonify({'error': False, 'message': 'Product Updated Successfully', 'product': product_data}), 200

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500


@app.route('/delete-product/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        result = Product.objects(id=ObjectId(product_id)).delete()
        if result == 0:
            return jsonify({'error': True, 'message': 'Product not found'}), 404

        return jsonify({'error': False, 'message': 'Product Deleted Successfully'}), 200

    except Exception as e:
        return jsonify({'error': True, 'message': f'Internal server error: {str(e)}'}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
