from PIL import Image, ImageChops

def trim(im):
    # Create background image of same color as top-left pixel
    bg = Image.new(im.mode, im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

try:
    im = Image.open("public/logo.png").convert("RGB")
    cropped = trim(im)
    
    # Add a small padding margin (e.g. 10px) to keep it clean
    margin = 10
    width, height = cropped.size
    new_im = Image.new("RGB", (width + 2*margin, height + 2*margin), (255, 255, 255))
    new_im.paste(cropped, (margin, margin))
    new_im.save("public/logo.png", "PNG")
    print("Logo trimmed and cropped successfully!")
except Exception as e:
    print(f"Error cropping logo: {e}")
