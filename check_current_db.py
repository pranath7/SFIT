import requests
import os

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

env = load_env()
url = f"{env['VITE_SUPABASE_URL']}/rest/v1/products"
headers = {
    'apikey': env['VITE_SUPABASE_ANON_KEY'],
    'Authorization': f"Bearer {env['VITE_SUPABASE_ANON_KEY']}"
}

res = requests.get(url, headers=headers)
if res.status_code == 200:
    products = res.json()
    print(f"Total products currently in Supabase: {len(products)}")
    for idx, p in enumerate(products):
        print(f"  {idx+1}. ID: {p.get('id')} | Name: {p.get('name')} | Status: {p.get('status')}")
else:
    print(f"Failed to fetch products. Code: {res.status_code}, Response: {res.text}")
