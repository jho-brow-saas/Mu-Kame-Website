import os
from PIL import Image

def process_favicon():
    input_path = "/tmp/user-uploads/ChatGPT_Image_4_de_ago._de_2026_20_19_56.png"
    output_dir = "public"
    
    if not os.path.exists(input_path):
        print(f"Erro: Arquivo {input_path} não encontrado.")
        return

    # Abrir imagem e garantir que tenha canal alpha
    img = Image.open(input_path).convert("RGBA")
    
    # Remover margens transparentes (crop agressivo)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Imagem croppada para {bbox}")
    
    # Redimensionar para os formatos necessários
    sizes = {
        "favicon-16x16.png": (16, 16),
        "favicon-32x32.png": (32, 32),
        "apple-touch-icon.png": (180, 180),
        "android-chrome-192x192.png": (192, 192),
        "android-chrome-512x512.png": (512, 512),
    }
    
    for filename, size in sizes.items():
        resized = img.resize(size, Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, filename))
        print(f"Gerado: {filename} ({size[0]}x{size[1]})")
        
    # Gerar favicon.ico (multi-resolução)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
    ico_images[0].save(
        os.path.join(output_dir, "favicon.ico"),
        format="ICO",
        sizes=ico_sizes,
        append_images=ico_images[1:]
    )
    print("Gerado: favicon.ico")

if __name__ == "__main__":
    process_favicon()
