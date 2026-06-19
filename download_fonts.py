import os
import requests

def download_file(url, output_path):
    print(f"Downloading {url} ...")
    res = requests.get(url, stream=True)
    if res.status_code == 200:
        with open(output_path, 'wb') as f:
            for chunk in res.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully saved to {output_path}")
    else:
        print(f"Failed to download {url}. Status code: {res.status_code}")

def main():
    fonts_dir = "fonts"
    os.makedirs(fonts_dir, exist_ok=True)
    
    font_urls = {
        "DMSans-Bold.ttf": "https://github.com/googlefonts/dm-fonts/raw/main/Sans/Exports/DMSans-Bold.ttf",
        "DMSans-Medium.ttf": "https://github.com/googlefonts/dm-fonts/raw/main/Sans/Exports/DMSans-Medium.ttf",
        "DMSans-Regular.ttf": "https://github.com/googlefonts/dm-fonts/raw/main/Sans/Exports/DMSans-Regular.ttf"
    }
    
    for filename, url in font_urls.items():
        dest = os.path.join(fonts_dir, filename)
        if not os.path.exists(dest):
            download_file(url, dest)
        else:
            print(f"{filename} already exists, skipping download.")

if __name__ == "__main__":
    main()
