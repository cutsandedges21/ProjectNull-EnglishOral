import re
import sys

def main():
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()

        def add_logo(match):
            section_tag = match.group(1)
            inner = match.group(2)
            if 'nullLogo.png' in inner:
                return match.group(0) # Already has logo
                
            # Check panel orientation to decide left/right
            if 'left-panel' in inner:
                logo_html = '\n                <img src="assets/nullLogo.png" class="corner-logo left" alt="Null Logo">'
            else:
                logo_html = '\n                <img src="assets/nullLogo.png" class="corner-logo" alt="Null Logo">'
                
            return section_tag + logo_html + inner

        new_content = re.sub(r'(<section class="slide"[^>]*>)(.*?)(</section>)', add_logo, content, flags=re.DOTALL)

        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated index.html")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
