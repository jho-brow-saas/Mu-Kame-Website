import os
from PIL import Image

def magnify_and_rebuild():
    source_path = "public/android-chrome-512x512.png"
    if not os.path.exists(source_path):
        print(f"Erro: {source_path} não encontrado.")
        return

    img = Image.open(source_path).convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        print("Erro: Imagem vazia.")
        return
    
    content_img = img.crop(bbox)
    
    def resize_to_fill_max(content, size, fill_factor=0.96):
        target_content_size = int(size * fill_factor)
        # Para resoluções muito baixas (16, 32), garantimos pelo menos 1px de margem se possível, 
        # mas priorizamos o tamanho solicitado (96%).
        if size <= 32:
            target_content_size = size - 2 # 1px cada lado
            
        w, h = content.size
        ratio = min(target_content_size / w, target_content_size / h)
        new_w, new_h = int(w * ratio), int(h * ratio)
        
        resized_content = content.resize((new_w, new_h), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        offset = ((size - new_w) // 2, (size - new_h) // 2)
        canvas.paste(resized_content, offset, resized_content)
        return canvas

    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "favicon-48x48.png": 48,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512
    }

    for name, size in sizes.items():
        processed = resize_to_fill_max(content_img, size)
        processed.save(f"public/{name}")
        print(f"Atualizado fisicamente: public/{name} ({size}x{size}) - {os.path.getsize(f'public/{name}')} bytes")

    # ICO com múltiplas camadas
    ico_imgs = [resize_to_fill_max(content_img, s) for s in [16, 32, 48, 64]]
    ico_imgs[0].save("public/favicon.ico", format="ICO", append_images=ico_imgs[1:])
    print(f"Atualizado fisicamente: public/favicon.ico - {os.path.getsize('public/favicon.ico')} bytes")

if __name__ == "__main__":
    magnify_and_rebuild()
