from PIL import Image

def remove_white_bg(input_path, output_path, threshold=220):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If all r, g, b are above threshold, it's white-ish
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

remove_white_bg(
    r"C:\Users\PREETHAM\.gemini\antigravity\brain\14c07a33-e855-42ea-8997-cd40c3d040a1\media__1782996681014.jpg",
    r"c:\Users\PREETHAM\.gemini\antigravity\scratch\property-app\public\logo.png"
)
