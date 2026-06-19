import os
import sys
import json
import math
import argparse
import requests
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageChops

# Configuration & Paths
ENV_FILE = ".env.local"
FONTS_DIR = "fonts"
POSTED_PRODUCTS_FILE = "posted_products.json"
LOGO_PATH = "public/logo.png"

# Color Palette (Matches website brand)
COLOR_PRIMARY = (27, 59, 111)      # #1b3b6f (Navy Blue)
COLOR_TEXT_DARK = (30, 41, 59)      # #1e293b (Charcoal)
COLOR_TEXT_MUTED = (100, 116, 139)  # #64748b (Slate Slate)
COLOR_ACCENT = (141, 169, 196)     # #8da9c4 (Electric Blue)
COLOR_WHITE = (255, 255, 255)
COLOR_DARK_BLUE = (15, 23, 42)      # #0f172a (Darker Navy)

def load_env():
    env_vars = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    parts = line.split('=', 1)
                    if len(parts) == 2:
                        env_vars[parts[0].strip()] = parts[1].strip()
    return env_vars

def fetch_supabase_products(env):
    supabase_url = env.get('VITE_SUPABASE_URL')
    anon_key = env.get('VITE_SUPABASE_ANON_KEY')
    
    if not supabase_url or not anon_key:
        print("Warning: Supabase credentials missing in .env.local, falling back to local fallback JSON...")
        return load_fallback_products()
        
    url = f"{supabase_url}/rest/v1/products"
    headers = {
        'apikey': anon_key,
        'Authorization': f"Bearer {anon_key}",
        'Content-Type': 'application/json'
    }
    
    try:
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            return res.json()
        else:
            print(f"Supabase request failed: {res.status_code}. Falling back to local fallback JSON...")
            return load_fallback_products()
    except Exception as e:
        print(f"Error connecting to Supabase: {e}. Falling back to local fallback JSON...")
        return load_fallback_products()

def load_fallback_products():
    fallback_path = "src/data/fallbackProducts.json"
    if os.path.exists(fallback_path):
        with open(fallback_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def get_category_metadata(category):
    # Map features and taglines
    metadata = {
        "kitchen-accessories": {
            "tagline": "MAXIMUM STORAGE. EFFORTLESS DESIGN.",
            "features": [
                "Premium Satin / Dark Grey Finish",
                "Maximize Corner & Cabinet Space",
                "Smooth Soft-Close Hydraulic Operation",
                "Heavy Load Bearing Capacity",
                "Easy to Clean & Maintain"
            ]
        },
        "sliding-fittings": {
            "tagline": "SMOOTH SLIDING. WHISPER QUIET.",
            "features": [
                "Heavy-Duty Smooth Sliding Action",
                "High Load-Bearing Capacity (up to 80kg)",
                "Whisper-Quiet Whisper Rollers",
                "Perfect for Modern Wardrobes & Doors",
                "Quick & Easy Alignment Setup"
            ]
        },
        "furniture-fixtures": {
            "tagline": "ENGINEERED STRENGTH. LASTING DURABILITY.",
            "features": [
                "Professional-Grade Steel Fitting",
                "Exceptional Structural Integrity",
                "Engineered For Frequent Daily Use",
                "Rust & Wear Resistant Plating",
                "Universal Compatibility Design"
            ]
        },
        "sofa-legs": {
            "tagline": "STURDY SUPPORT. MODERN STYLE.",
            "features": [
                "Heavy-Duty Solid Metal Construction",
                "High Weight-Bearing Capacity",
                "Corrosion Resistant Metallic Plating",
                "Sleek Contemporary Profile",
                "Non-Slip Protective Floor Pads"
            ]
        },
        "bathroom-accessories": {
            "tagline": "RUST-RESISTANT. LUXURY FINISH.",
            "features": [
                "Rust & Corrosion Proof SS 304 Grade",
                "Elegant Polished & Glossy Finish",
                "Clean Modern Space Saving Design",
                "Sturdy & Solid Wall-Mount Fittings",
                "Designed For Moist Environments"
            ]
        },
        "profiles": {
            "tagline": "SLEEK PROFILES. ARCHITECTURAL STYLING.",
            "features": [
                "Premium Architectural Aluminum Profile",
                "Sleek Handle-less Drawer Design",
                "Anodized Finish - No Fading/Scratch",
                "Easy Snap-fit & Channel Install",
                "Perfect for Luxury Modular Kitchens"
            ]
        }
    }
    
    return metadata.get(category, {
        "tagline": "PREMIUM QUALITY. MODERN DESIGN.",
        "features": [
            "Premium Engineered Quality",
            "Modern & Elegant Aesthetic Design",
            "High-Grade Durable Materials",
            "Easy & Hassle-free Installation",
            "Smooth Functional Performance"
        ]
    })

def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        w = draw.textlength(test_line, font=font)
        if w <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines

# Icon drawings for the footer banner
def draw_star(draw, center, size, color):
    cx, cy = center
    r = size / 2
    points = []
    for i in range(10):
        angle = i * 36 * 3.14159 / 180
        curr_r = r if i % 2 == 0 else r * 0.4
        x = cx + curr_r * math.sin(angle)
        y = cy - curr_r * math.cos(angle)
        points.append((x, y))
    draw.polygon(points, outline=color, width=2)

def draw_diamond(draw, center, size, color):
    cx, cy = center
    r = size / 2
    points = [
        (cx, cy - r),
        (cx + r, cy),
        (cx, cy + r),
        (cx - r, cy)
    ]
    draw.polygon(points, outline=color, width=2)

def draw_shield(draw, center, size, color):
    cx, cy = center
    r = size / 2
    points = [
        (cx - r*0.8, cy - r),
        (cx + r*0.8, cy - r),
        (cx + r*0.8, cy),
        (cx, cy + r),
        (cx - r*0.8, cy)
    ]
    draw.polygon(points, outline=color, width=2)

def draw_house(draw, center, size, color):
    cx, cy = center
    r = size / 2
    # roof
    draw.polygon([(cx, cy - r), (cx + r*0.9, cy - r*0.1), (cx - r*0.9, cy - r*0.1)], outline=color, width=2)
    # body
    draw.rectangle([(cx - r*0.7, cy - r*0.1), (cx + r*0.7, cy + r*0.9)], outline=color, width=2)

def download_image(url):
    try:
        res = requests.get(url, timeout=10)
        if res.status_code == 200:
            return Image.open(BytesIO(res.content))
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    return None

def generate_image(product, output_path):
    # 1. Create a 1080x1080 canvas
    canvas = Image.new("RGB", (1080, 1080), COLOR_WHITE)
    draw = ImageDraw.Draw(canvas)
    
    # 2. Draw Left Panel Background (Horizontal Gradient)
    # Warm beige/grey gradient from x=0 (fcfbf9) to x=520 (f2f0eb)
    for x in range(520):
        factor = x / 520.0
        r = int(252 - (252 - 242) * factor)
        g = int(251 - (251 - 240) * factor)
        b = int(249 - (249 - 235) * factor)
        draw.line([(x, 0), (x, 1000)], fill=(r, g, b))
        
    # 3. Draw Soft Panel Shadow
    overlay = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for w in range(25):
        alpha = int(45 * (1.0 - w / 25.0))
        overlay_draw.line([(520 + w, 0), (520 + w, 1000)], fill=(0, 0, 0, alpha))
    
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    
    # 4. Load Fonts
    font_bold_path = os.path.join(FONTS_DIR, "DMSans-Bold.ttf")
    font_med_path = os.path.join(FONTS_DIR, "DMSans-Medium.ttf")
    font_reg_path = os.path.join(FONTS_DIR, "DMSans-Regular.ttf")
    
    # Check fallback if fonts not downloaded
    if not os.path.exists(font_bold_path):
        font_bold = font_med = font_reg = ImageFont.load_default()
        print("Warning: DM Sans fonts not found, using default fallback font.")
    else:
        font_bold_size = lambda s: ImageFont.truetype(font_bold_path, s)
        font_med_size = lambda s: ImageFont.truetype(font_med_path, s)
        font_reg_size = lambda s: ImageFont.truetype(font_reg_path, s)
        
    # 5. Paste S-FIT Logo
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image.open(LOGO_PATH).convert("RGBA")
            # Proportional resize to height 48
            logo_w, logo_h = logo.size
            new_h = 48
            new_w = int(logo_w * (new_h / logo_h))
            logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
            canvas.paste(logo, (60, 60), logo)
        except Exception as e:
            print(f"Error loading logo: {e}")
            draw.text((60, 60), "S-FIT HARDWARE", fill=COLOR_PRIMARY, font=font_bold_size(24))
    else:
        draw.text((60, 60), "S-FIT HARDWARE", fill=COLOR_PRIMARY, font=font_bold_size(24))
        
    # 6. Draw "NEW LAUNCH" Badge
    badge_x1, badge_y1, badge_x2, badge_y2 = 60, 155, 230, 195
    draw.rectangle([badge_x1, badge_y1, badge_x2, badge_y2], fill=COLOR_PRIMARY)
    # Badge text
    draw.text((badge_x1 + 18, badge_y1 + 8), "NEW LAUNCH", fill=COLOR_WHITE, font=font_bold_size(14))
    
    # 7. Render Product Name (with Wrap and Auto-Shrink)
    prod_name = product.get("name", "PREMIUM HARDWARE").upper()
    font_size = 36
    name_font = font_bold_size(font_size)
    lines = wrap_text(prod_name, name_font, 400, draw)
    
    # If it's too long, scale font size down
    if len(lines) > 3:
        font_size = 28
        name_font = font_bold_size(font_size)
        lines = wrap_text(prod_name, name_font, 400, draw)
        
    y_cursor = 220
    for line in lines:
        draw.text((60, y_cursor), line, fill=COLOR_PRIMARY, font=name_font)
        y_cursor += (font_size + 8)
        
    # 8. Draw Divider Under Title
    draw.line([(60, y_cursor + 6), (150, y_cursor + 6)], fill=COLOR_PRIMARY, width=3)
    y_cursor += 24
    
    # 9. Get Category Metadata
    cat_meta = get_category_metadata(product.get("category"))
    
    # Draw Tagline
    draw.text((60, y_cursor), cat_meta["tagline"], fill=COLOR_PRIMARY, font=font_bold_size(14))
    y_cursor += 36
    
    # Draw Bullet Points
    features = cat_meta["features"][:4]  # Limit to top 4 for space
    for feature in features:
        # Draw Circle Checkmark
        circle_x, circle_y = 75, y_cursor + 10
        draw.ellipse([(circle_x - 13, circle_y - 13), (circle_x + 13, circle_y + 13)], fill=COLOR_PRIMARY)
        
        # Checkmark vector drawing
        draw.line([(circle_x - 5, circle_y), (circle_x - 1, circle_y + 4)], fill=COLOR_WHITE, width=2)
        draw.line([(circle_x - 1, circle_y + 4), (circle_x + 5, circle_y - 4)], fill=COLOR_WHITE, width=2)
        
        # Draw Feature Text
        draw.text((105, y_cursor), feature, fill=COLOR_TEXT_DARK, font=font_med_size(16))
        y_cursor += 48
        
    # 10. Starting Price Section
    price_val = product.get("price", 0)
    # Parse variants if present
    description = product.get("description", "")
    variants_list = product.get("variants", [])
    
    if variants_list:
        lowest_price = min([v.get("price", price_val) for v in variants_list])
        price_text = f"Rs. {lowest_price:,}"
        prefix = "STARTING FROM"
    else:
        price_text = f"Rs. {price_val:,}"
        prefix = "PRICE"
        
    draw.text((60, 720), prefix, fill=COLOR_TEXT_MUTED, font=font_bold_size(12))
    draw.text((60, 736), price_text, fill=COLOR_PRIMARY, font=font_bold_size(38))
    
    # 11. Website Banner Left Side
    banner_y1, banner_y2 = 835, 905
    # Ribbon style or simple cut
    draw.rectangle([0, banner_y1, 410, banner_y2], fill=COLOR_PRIMARY)
    
    # Draw Globe icon inside Website Banner
    globe_cx, globe_cy = 45, 870
    draw.ellipse([(globe_cx - 14, globe_cy - 14), (globe_cx + 14, globe_cy + 14)], outline=COLOR_WHITE, width=2)
    draw.line([(globe_cx - 14, globe_cy), (globe_cx + 14, globe_cy)], fill=COLOR_WHITE, width=2)
    draw.line([(globe_cx, globe_cy - 14), (globe_cx, globe_cy + 14)], fill=COLOR_WHITE, width=2)
    draw.ellipse([(globe_cx - 7, globe_cy - 14), (globe_cx + 7, globe_cy + 14)], outline=COLOR_WHITE, width=2)
    
    # Banner Text
    draw.text((75, banner_y1 + 10), "VISIT OUR WEBSITE", fill=COLOR_ACCENT, font=font_bold_size(11))
    draw.text((75, banner_y1 + 24), "sfitkitchen.com", fill=COLOR_WHITE, font=font_bold_size(18))
    
    # 12. Right Side: Centered Product Image
    img_urls = product.get("images", [])
    if img_urls and img_urls[0]:
        img_url = img_urls[0]
        # Download or load locally
        prod_img = None
        if img_url.startswith("http"):
            prod_img = download_image(img_url)
        else:
            # Local fallback paths
            local_paths = [
                os.path.join("public", img_url.lstrip("/")),
                img_url,
                os.path.join(r"C:\Users\91636\Documents\Codex\2026-06-18\files-mentioned-by-the-user-catalog\outputs\product_photos", os.path.basename(img_url))
            ]
            for p in local_paths:
                if os.path.exists(p):
                    try:
                        prod_img = Image.open(p)
                        break
                    except Exception as e:
                        print(f"Error opening local image {p}: {e}")
                        
        if prod_img:
            # Resize proportionally to fit in a 480x750 box on the right
            prod_img = prod_img.convert("RGBA")
            p_w, p_h = prod_img.size
            max_w, max_h = 480, 750
            ratio = min(max_w / p_w, max_h / p_h)
            new_pw = int(p_w * ratio)
            new_ph = int(p_h * ratio)
            prod_img = prod_img.resize((new_pw, new_ph), Image.Resampling.LANCZOS)
            
            # Center on the right half: x range (540, 1060), y range (100, 900)
            right_center_x = 520 + (1080 - 520) // 2
            right_center_y = 100 + (900 - 100) // 2
            paste_x = right_center_x - new_pw // 2
            paste_y = right_center_y - new_ph // 2
            
            # Place product image
            # Make a temp white bg for pasting alpha
            temp_bg = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
            temp_bg.paste(prod_img, (paste_x, paste_y), prod_img)
            canvas = Image.alpha_composite(canvas.convert("RGBA"), temp_bg).convert("RGB")
            draw = ImageDraw.Draw(canvas)
        else:
            draw.text((750, 480), "[Product Photo]", fill=COLOR_TEXT_MUTED, font=font_med_size(18))
    else:
        draw.text((750, 480), "[No Photo]", fill=COLOR_TEXT_MUTED, font=font_med_size(18))
        
    # 13. Draw Footer Bar (y: 1000 to 1080)
    draw.rectangle([0, 1000, 1080, 1080], fill=COLOR_PRIMARY)
    
    # Dividers
    draw.line([(270, 1015), (270, 1065)], fill=COLOR_ACCENT, width=1)
    draw.line([(540, 1015), (540, 1065)], fill=COLOR_ACCENT, width=1)
    draw.line([(810, 1015), (810, 1065)], fill=COLOR_ACCENT, width=1)
    
    # Highlights & Icons centering calculations
    highlights = [
        {"icon": "star", "text": "PREMIUM QUALITY", "cx": 135},
        {"icon": "diamond", "text": "MODERN & STYLISH", "cx": 405},
        {"icon": "shield", "text": "BUILT FOR DURABILITY", "cx": 675},
        {"icon": "house", "text": "PERFECT FOR SPACES", "cx": 945}
    ]
    
    for h in highlights:
        cx = h["cx"]
        cy = 1040
        text = h["text"]
        
        # Calculate width of icon + space + text to center them together
        text_w = draw.textlength(text, font=font_bold_size(11))
        icon_size = 18
        icon_spacing = 8
        total_w = icon_size + icon_spacing + text_w
        
        start_x = cx - total_w // 2
        icon_cx = start_x + icon_size // 2
        text_x = start_x + icon_size + icon_spacing
        
        # Draw icon
        if h["icon"] == "star":
            draw_star(draw, (icon_cx, cy), icon_size, COLOR_WHITE)
        elif h["icon"] == "diamond":
            draw_diamond(draw, (icon_cx, cy), icon_size, COLOR_WHITE)
        elif h["icon"] == "shield":
            draw_shield(draw, (icon_cx, cy), icon_size, COLOR_WHITE)
        elif h["icon"] == "house":
            draw_house(draw, (icon_cx, cy), icon_size, COLOR_WHITE)
            
        # Draw text
        draw.text((text_x, cy - 6), text, fill=COLOR_WHITE, font=font_bold_size(11))
        
    # Save Image
    canvas.save(output_path, "PNG")
    print(f"Branded image saved to {output_path}")
    return True

def upload_to_cloudinary(env, img_path):
    cloud_name = env.get('VITE_CLOUDINARY_CLOUD_NAME')
    upload_preset = env.get('VITE_CLOUDINARY_UPLOAD_PRESET')
    
    if not cloud_name or not upload_preset:
        print("Error: Cloudinary credentials missing in env")
        return None
        
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    try:
        with open(img_path, 'rb') as f:
            files = { 'file': (os.path.basename(img_path), f, 'image/png') }
            data = { 'upload_preset': upload_preset }
            res = requests.post(url, files=files, data=data)
            
        if res.status_code in [200, 201]:
            return res.json().get("secure_url")
        else:
            print(f"Cloudinary upload failed: {res.status_code}, {res.text}")
            return None
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None

def generate_caption(product):
    name = product.get("name", "Premium Hardware").title()
    category = product.get("category", "").replace("-", " ").title()
    desc = product.get("description", "")
    
    # Strip variants part of description if present
    if "|||VARIANTS|||" in desc:
        desc = desc.split("|||VARIANTS|||")[0]
        
    price = product.get("price", 0)
    variants = product.get("variants", [])
    
    caption = f"✨ New Arrival at S-FIT Hardware! ✨\n\n"
    caption += f"🔨 {name}\n"
    
    if category:
        caption += f"📂 Category: {category}\n"
        
    if variants:
        lowest_price = min([v.get("price", price) for v in variants])
        caption += f"💰 Starting from ₹{lowest_price:,}\n"
        sizes = [v.get("size") for v in variants if v.get("size")]
        if sizes:
            caption += f"📏 Available Sizes/Variants: {', '.join(sizes)}\n"
    else:
        caption += f"💰 Price: ₹{price:,}\n"
        
    caption += f"\n📝 Description:\n{desc}\n\n"
    caption += f"📞 Inquiry/WhatsApp: +91 99622 85822\n"
    caption += f"🌐 View Catalog: sfitkitchen.com\n\n"
    
    # Dynamic hashtags based on category
    hashtags = ["#SFITHardware", "#KitchenFittings", "#ModularKitchen", "#InteriorDesign", "#HardwareSolutions"]
    if category == "Kitchen Accessories":
        hashtags += ["#KitchenAccessories", "#KitchenOrganizer"]
    elif category == "Sliding Fittings":
        hashtags += ["#SlidingWardrobe", "#SlidingDoors"]
    elif category == "Profiles":
        hashtags += ["#GolaProfile", "#AluminumProfile"]
        
    caption += " ".join(hashtags)
    return caption

def get_posted_products():
    if os.path.exists(POSTED_PRODUCTS_FILE):
        try:
            with open(POSTED_PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_posted_products(posted_list):
    with open(POSTED_PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(posted_list, f, indent=2)

def main():
    # Save original stdout and redirect standard prints to stderr so they don't corrupt JSON output for CLI parsing
    original_stdout = sys.stdout
    sys.stdout = sys.stderr

    parser = argparse.ArgumentParser(description="SFIT Branded Instagram Post Generator")
    parser.add_argument("--id", type=str, help="Specific product ID to generate post for")
    parser.add_argument("--auto", action="store_true", help="Auto post next unpublished product")
    parser.add_argument("--upload", action="store_true", help="Force upload to Cloudinary for single ID run")
    parser.add_argument("--output", type=str, default="instagram_post_test.png", help="Output file path")
    args = parser.parse_args()
    
    env = load_env()
    products = fetch_supabase_products(env)
    
    if not products:
        print("Error: No products found!")
        sys.exit(1)
        
    target_product = None
    is_auto = args.auto
    
    if args.id:
        # Find product by ID
        for p in products:
            if p.get("id") == args.id:
                target_product = p
                break
        if not target_product:
            print(f"Error: Product ID {args.id} not found.")
            sys.exit(1)
    elif is_auto:
        posted = get_posted_products()
        # Find first product not in posted
        for p in products:
            if p.get("id") not in posted:
                target_product = p
                break
        if not target_product:
            sys.stdout = original_stdout
            print(json.dumps({"status": "no_new_products", "message": "All products have already been posted!"}))
            sys.exit(0)
    else:
        # Default to first product for test
        target_product = products[0]
        print(f"No ID specified. Defaulting to test product: {target_product.get('name')}")
        
    print(f"Selected Product: {target_product.get('name')} (ID: {target_product.get('id')})")
    
    # Generate the image locally
    temp_img_path = "temp_insta_post_output.png" if is_auto else args.output
    success = generate_image(target_product, temp_img_path)
    
    if not success:
        print("Error: Image generation failed!")
        sys.exit(1)
        
    cloudinary_url = None
    
    # Handle Cloudinary upload
    if is_auto or args.upload:
        print("Uploading generated image to Cloudinary...")
        cloudinary_url = upload_to_cloudinary(env, temp_img_path)
        
        # Clean up temp image in auto mode
        if is_auto and os.path.exists(temp_img_path):
            os.remove(temp_img_path)
            
        if not cloudinary_url:
            print("Error: Cloudinary upload failed!")
            sys.exit(1)
            
        print(f"Cloudinary Hosted URL: {cloudinary_url}")
        
    caption = generate_caption(target_product)
    
    # Update posted tracker
    if is_auto:
        posted = get_posted_products()
        posted.append(target_product.get("id"))
        save_posted_products(posted)
        
    # Output result block (formatted as JSON for n8n execution node)
    result_json = {
        "status": "success",
        "product_id": target_product.get("id"),
        "product_name": target_product.get("name"),
        "image_url": cloudinary_url or os.path.abspath(temp_img_path),
        "caption": caption
    }
    
    # Restore stdout and print clean JSON
    sys.stdout = original_stdout
    print(json.dumps(result_json, indent=2))

if __name__ == "__main__":
    main()
