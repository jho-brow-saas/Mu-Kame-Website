import os
from PIL import Image

def magnify_and_rebuild():
    # We'll use the largest source available in public/ as our base for re-cropping
    # android-chrome-512x512.png is usually the best source.
    source_path = "public/android-chrome-512x512.png"
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        return

    img = Image.open(source_path).convert("RGBA")
    
    # 1. Precise crop to content
    bbox = img.getbbox()
    if not bbox:
        print("Error: Image is empty.")
        return
    
    # content_img is the tightest possible crop
    content_img = img.crop(bbox)
    
    # 2. Re-pad slightly to hit 90-95% occupation
    # 92.5% occupation means 7.5% margin total (3.75% each side)
    def resize_to_fill(content, size, fill_factor=0.925):
        target_content_size = int(size * fill_factor)
        
        # Maintain aspect ratio
        w, h = content.size
        ratio = min(target_content_size / w, target_content_size / h)
        new_w, new_h = int(w * ratio), int(h * ratio)
        
        resized_content = content.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create transparent canvas
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        # Center
        offset = ((size - new_w) // 2, (size - new_h) // 2)
        canvas.paste(resized_content, offset, resized_content)
        return canvas

    # Generate all required sizes
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-48x48.png": 48,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512
    }

    processed_images = {}
    for name, size in sizes.items():
        processed = resize_to_fill(content_img, size)
        processed.save(f"public/{name}")
        processed_images[size] = processed
        print(f"Updated public/{name}")

    # Generate multi-resolution .ico
    ico_sizes = [16, 32, 48, 64] # Common ico sizes
    ico_imgs = []
    for s in ico_sizes:
        ico_imgs.append(resize_to_fill(content_img, s))
    
    processed_images[512].save("public/favicon.ico", format="ICO", sizes=[(s, s) for s in [16, 32, 48, 64]])
    print("Updated public/favicon.ico")

if __name__ == "__main__":
    magnify_and_rebuild()
