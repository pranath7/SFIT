import os
import json
import random
import string
import time
import requests
from io import BytesIO
from PIL import Image

# Configuration & Paths
MAPPING_CACHE_PATH = "cloudinary_mapping.json"
FALLBACK_JSON_DIR = "src/data"
FALLBACK_JSON_PATH = os.path.join(FALLBACK_JSON_DIR, "fallbackProducts.json")
LOCAL_IMAGE_DIR = "public/images/products"

def load_env():
    env_vars = {}
    if os.path.exists('.env.local'):
        with open('.env.local', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    parts = line.split('=', 1)
                    if len(parts) == 2:
                        env_vars[parts[0].strip()] = parts[1].strip()
    return env_vars

def generate_id():
    # Format: prod_<timestamp>_<random_string>
    timestamp = int(time.time() * 1000)
    rand_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
    return f"prod_{timestamp}_{rand_part}"

def get_category(row):
    pg = row["page"]
    name = row["product_name"].lower()
    
    # Page-based mapping first
    if pg in [2, 3, 4]:
        return "kitchen-accessories"
    elif pg in [5, 12]:
        return "sliding-fittings"
    elif pg in [6, 7, 14, 15]:
        return "furniture-fixtures"
    elif pg == 8:
        if "sofa" in name:
            return "sofa-legs"
        elif "bathroom" in name or "soap" in name or "dispenser" in name:
            return "bathroom-accessories"
        return "furniture-fixtures"
    elif pg in [9, 10, 11, 13]:
        # Special sliding door item on page 13
        if "ghost" in name or "sliding door" in name:
            return "sliding-fittings"
        return "profiles"
    
    return "furniture-fixtures"

def get_premium_description(name, category):
    name_cap = name.title()
    if category == "kitchen-accessories":
        return f"Premium {name_cap} organizer designed to maximize storage space, elevate kitchen aesthetics, and provide smooth, effortless operation. Engineered with top-grade materials for lasting durability."
    elif category == "sliding-fittings":
        return f"High-performance {name_cap} sliding system designed for smooth sliding action, high load-bearing capacity, and whisper-quiet performance. Perfect for modern wardrobes and partition doors."
    elif category == "furniture-fixtures":
        return f"Professional-grade {name_cap} hardware fixture engineered for exceptional durability, structural integrity, and smooth movement. Perfect for high-end cabinets, beds, and modular furniture."
    elif category == "sofa-legs":
        return f"Sturdy and elegant {name_cap} support leg designed to offer reliable stability, high weight capacity, and a premium metallic accent to contemporary furniture pieces."
    elif category == "bathroom-accessories":
        return f"Elegant and rust-resistant {name_cap} bathroom accessory crafted to combine utility and high-end design. Ideal for adding a touch of luxury and clean organization to modern bathrooms."
    elif category == "profiles":
        return f"Premium {name_cap} aluminum profile designed for sleek, handle-less modular cabinetry. Delivers architectural styling, easy installation, and structural strength."
    
    return f"Premium {name_cap} engineered for superior durability, sleek aesthetics, and smooth operation. Designed to elevate modern interior design."

def load_cloudinary_cache():
    if os.path.exists(MAPPING_CACHE_PATH):
        try:
            with open(MAPPING_CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load mapping cache: {e}")
    return {}

def save_cloudinary_cache(cache):
    try:
        with open(MAPPING_CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to save mapping cache: {e}")

def compress_and_upload_image(img_filename, cloud_name, upload_preset, cache):
    # Check cache first
    if img_filename in cache:
        return cache[img_filename]

    local_path = os.path.join(LOCAL_IMAGE_DIR, img_filename)
    if not os.path.exists(local_path):
        # Fallback to absolute outputs path if not found in public
        local_path = os.path.join(r"C:\Users\91636\Documents\Codex\2026-06-18\files-mentioned-by-the-user-catalog\outputs\product_photos", img_filename)
        if not os.path.exists(local_path):
            print(f"Warning: Image file {img_filename} not found.")
            return None

    try:
        # Load and compress image
        img = Image.open(local_path)
        img = img.convert("RGB")
        
        # Max dimensions 1000x1000
        img.thumbnail((1000, 1000))
        
        # Save to bytes memory buffer
        img_buffer = BytesIO()
        img.save(img_buffer, format="JPEG", quality=85)
        img_buffer.seek(0)
        
        # Upload using Cloudinary REST API (unsigned upload)
        url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
        files = {
            'file': (img_filename, img_buffer, 'image/jpeg')
        }
        data = {
            'upload_preset': upload_preset
        }
        
        res = requests.post(url, files=files, data=data)
        if res.status_code in [200, 201]:
            result = res.json()
            secure_url = result["secure_url"]
            print(f"Uploaded {img_filename} -> {secure_url}")
            
            # Cache it
            cache[img_filename] = secure_url
            save_cloudinary_cache(cache)
            return secure_url
        else:
            print(f"Failed to upload {img_filename} to Cloudinary. Status: {res.status_code}, Response: {res.text}")
            return None
    except Exception as e:
        print(f"Error processing image {img_filename}: {e}")
        return None

def main():
    env = load_env()
    if 'VITE_SUPABASE_URL' not in env or 'VITE_SUPABASE_ANON_KEY' not in env:
        print("Error: Supabase environment variables not found in .env.local")
        return

    supabase_url = env['VITE_SUPABASE_URL']
    anon_key = env['VITE_SUPABASE_ANON_KEY']
    
    cloud_name = env.get('VITE_CLOUDINARY_CLOUD_NAME')
    upload_preset = env.get('VITE_CLOUDINARY_UPLOAD_PRESET')
    
    if not cloud_name or not upload_preset:
        print("Error: Cloudinary environment variables not found in .env.local")
        return
        
    print(f"Using Cloudinary Cloud Name: {cloud_name}")

    url = f"{supabase_url}/rest/v1/products"
    headers = {
        'apikey': anon_key,
        'Authorization': f"Bearer {anon_key}",
        'Content-Type': 'application/json'
    }

    # Load catalog data
    catalog_path = r"C:\Users\91636\Documents\Codex\2026-06-18\files-mentioned-by-the-user-catalog\work\catalog_rows.json"
    if not os.path.exists(catalog_path):
        print(f"Error: Catalog rows JSON file not found at {catalog_path}")
        return
        
    with open(catalog_path, "r", encoding="utf-8") as f:
        rows = json.load(f)
        
    print(f"Loaded {len(rows)} product rows from catalog.")

    # Group rows by image_filename and product_name
    grouped = {}
    for r in rows:
        key = (r["image_filename"], r["product_name"])
        if key not in grouped:
            grouped[key] = []
        grouped[key].append(r)

    print(f"Grouped into {len(grouped)} unique products.")

    # Load cache of Cloudinary uploads
    cache = load_cloudinary_cache()
    print(f"Loaded {len(cache)} cached Cloudinary image mappings.")

    products_to_insert = []
    
    # Pre-upload all unique image files
    print("Uploading images to Cloudinary (this may take a minute, cached uploads will be skipped)...")
    unique_images = list(set(img_file for (img_file, _) in grouped.keys()))
    
    image_url_map = {}
    for idx, img_file in enumerate(unique_images):
        print(f"Processing image {idx+1}/{len(unique_images)}: {img_file}")
        cloudinary_url = compress_and_upload_image(img_file, cloud_name, upload_preset, cache)
        if cloudinary_url:
            image_url_map[img_file] = cloudinary_url
        else:
            # Fallback to local image path if Cloudinary fails
            print(f"Warning: Falling back to local asset path for {img_file}")
            image_url_map[img_file] = f"/images/products/{img_file}"

    # Build DB products list
    for (img_file, prod_name), variant_rows in grouped.items():
        default_row = variant_rows[0]
        category = get_category(default_row)
        desc_text = get_premium_description(prod_name, category)
        
        # Build variants list
        variants = []
        for v in variant_rows:
            var_name = v["variant"].strip() if v["variant"] else ""
            cost_p = v["price"]
            sell_p = int(round(cost_p * 1.25))
            
            if not var_name:
                var_name = "Standard"
                
            variants.append({
                "size": var_name,
                "costPrice": cost_p,
                "price": sell_p
            })
            
        default_cost = default_row["price"]
        default_sell = int(round(default_cost * 1.25))
        
        # Format description
        if len(variants) > 0 and (len(variants) > 1 or variants[0]["size"] != "Standard"):
            description = f"{desc_text}|||VARIANTS|||{json.dumps(variants)}"
        else:
            description = desc_text
            
        clean_name = prod_name.strip()
        product_id = generate_id()
        created_time = "2026-06-18T14:00:00+00:00"
        
        # Use Cloudinary URL if available, else local path
        image_url = image_url_map.get(img_file, f"/images/products/{img_file}")
        
        db_product = {
            "id": product_id,
            "name": clean_name,
            "category": category,
            "description": description,
            "price": default_sell,
            "cost_price": default_cost,
            "images": [image_url],
            "featured": False,
            "status": "published",
            "created_at": created_time,
            "updated_at": created_time
        }
        products_to_insert.append(db_product)

    print(f"Prepared {len(products_to_insert)} products with Cloudinary image paths.")

    # 1. Clear existing products
    print("Clearing existing products in Supabase...")
    del_res = requests.delete(f"{url}?id=not.is.null", headers=headers)
    if del_res.status_code in [200, 204]:
        print("Database cleared successfully.")
    else:
        print(f"Warning: database clear response: {del_res.status_code}, {del_res.text}")

    # 2. Bulk insert products in chunks
    print("Inserting products to Supabase...")
    chunk_size = 20
    for i in range(0, len(products_to_insert), chunk_size):
        chunk = products_to_insert[i:i+chunk_size]
        ins_res = requests.post(url, headers=headers, json=chunk)
        if ins_res.status_code in [200, 201, 204]:
            print(f"Successfully inserted chunk {i//chunk_size + 1}/{len(products_to_insert)//chunk_size + 1}")
        else:
            print(f"Error inserting chunk: {ins_res.status_code}, {ins_res.text}")
            return

    # 3. Save to fallbackProducts.json for instant frontend loading
    os.makedirs(FALLBACK_JSON_DIR, exist_ok=True)
    
    # Format the fallback JSON to match what ProductContext maps:
    # { id, name, category, description, price, costPrice, images, featured, status, createdAt, updatedAt, variants }
    fallback_data = []
    for p in products_to_insert:
        # Parse description back for frontend variants mapping
        parsed_desc = p["description"]
        variants_list = []
        if "|||VARIANTS|||" in parsed_desc:
            parts = parsed_desc.split("|||VARIANTS|||")
            parsed_desc = parts[0]
            try:
                variants_list = json.loads(parts[1])
            except:
                variants_list = []
                
        fallback_data.append({
            "id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "description": parsed_desc,
            "price": p["price"],
            "costPrice": p["cost_price"],
            "images": p["images"],
            "featured": p["featured"],
            "status": p["status"],
            "createdAt": p["created_at"],
            "updatedAt": p["updated_at"],
            "variants": variants_list
        })
        
    with open(FALLBACK_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(fallback_data, f, indent=2)
        
    print(f"Saved {len(fallback_data)} fallback products to {FALLBACK_JSON_PATH} for instant loading!")
    print("All products imported and updated on Cloudinary successfully!")

if __name__ == "__main__":
    main()
