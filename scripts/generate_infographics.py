from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, math, random

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / 'assets' / 'images'
IMG_DIR.mkdir(parents=True, exist_ok=True)
W, H = 1200, 1800


def font(name, size):
    mapping = {
        'sans': 'C:/Windows/Fonts/arial.ttf',
        'sansb': 'C:/Windows/Fonts/arialbd.ttf',
        'serif': 'C:/Windows/Fonts/georgia.ttf',
        'serifb': 'C:/Windows/Fonts/georgiab.ttf',
    }
    try:
        return ImageFont.truetype(mapping.get(name, name), size)
    except Exception:
        return ImageFont.load_default(size)


def wrap(draw, value, fnt, width):
    words = value.split()
    lines = []
    current = ''
    for word in words:
        test = (current + ' ' + word).strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= width or not current:
            current = test
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_text(draw, xy, value, fnt, fill, max_width=None, spacing=8, anchor=None):
    x, y = xy
    if max_width:
        for line in wrap(draw, value, fnt, max_width):
            draw.text((x, y), line, font=fnt, fill=fill)
            y += draw.textbbox((0, 0), line, font=fnt)[3] + spacing
        return y
    draw.text((x, y), value, font=fnt, fill=fill, anchor=anchor)
    return y


def round_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient(bg1, bg2):
    image = Image.new('RGB', (W, H), bg1)
    pixels = image.load()
    for y in range(H):
        t = y / (H - 1)
        color = tuple(int(bg1[i] * (1 - t) + bg2[i] * t) for i in range(3))
        for x in range(W):
            pixels[x, y] = color
    return image.convert('RGBA')


def save_versions(image, slug):
    png = IMG_DIR / f'{slug}.png'
    image.save(png)
    rgb = image.convert('RGB')
    large = rgb.copy()
    large.thumbnail((1200, 1800), Image.Resampling.LANCZOS)
    large.save(IMG_DIR / f'{slug}-large.webp', 'WEBP', quality=88, method=6)
    thumb = rgb.copy()
    thumb.thumbnail((640, 960), Image.Resampling.LANCZOS)
    thumb.save(IMG_DIR / f'{slug}-thumb.webp', 'WEBP', quality=84, method=6)


def onion():
    image = gradient((255, 255, 255), (247, 249, 255))
    draw = ImageDraw.Draw(image)
    draw.ellipse((700, 170, 1160, 620), fill=(232, 224, 255, 130))
    draw.ellipse((-120, 900, 420, 1500), fill=(214, 240, 255, 120))
    draw_text(draw, (80, 80), 'Why onions make you cry', font('serifb', 78), (30, 28, 40), 860)
    draw_text(draw, (85, 270), 'Cutting an onion breaks cells and starts a tiny chemical chain reaction.', font('sans', 34), (82, 82, 92), 850)
    cx, cy = 360, 760
    for i, color in enumerate([(120, 75, 180), (150, 98, 210), (186, 142, 230), (218, 195, 246), (244, 236, 255)]):
        draw.ellipse((cx - 210 + i * 32, cy - 250 + i * 26, cx + 210 - i * 30, cy + 250 - i * 20), outline=color, width=18)
    draw.line((515, 720, 690, 640, 820, 600), fill=(80, 80, 90), width=6)
    steps = [('1. cells break', 'enzymes meet sulfur compounds'), ('2. gas forms', 'a stinging molecule floats upward'), ('3. tears start', 'your eyes rinse the irritant away')]
    for i, (label, desc) in enumerate(steps):
        y = 930 + i * 205
        round_rect(draw, (650, y, 1110, y + 145), 30, (255, 255, 255, 230), (225, 225, 235), 2)
        draw_text(draw, (685, y + 26), label, font('sansb', 30), (25, 25, 30))
        draw_text(draw, (685, y + 70), desc, font('sans', 25), (88, 88, 95), 360)
    draw_text(draw, (82, 1625), 'Takeaway: the tears are protection, not sadness.', font('sansb', 35), (30, 28, 40), 900)
    return image


def chili():
    image = gradient((24, 13, 10), (91, 20, 17))
    draw = ImageDraw.Draw(image)
    for radius, alpha in [(520, 30), (410, 42), (300, 58)]:
        draw.ellipse((600 - radius, 760 - radius, 600 + radius, 760 + radius), outline=(255, 130, 64, alpha), width=16)
    draw.arc((255, 450, 950, 930), 10, 182, fill=(255, 95, 48), width=70)
    draw.arc((280, 480, 900, 910), 15, 178, fill=(210, 22, 20), width=54)
    draw.line((760, 520, 875, 420), fill=(62, 128, 52), width=26)
    draw_text(draw, (78, 78), 'Why chili feels hot', font('serifb', 82), (255, 246, 236), 860)
    draw_text(draw, (84, 270), 'Capsaicin tricks a heat sensor. The pepper is not burning you, but your nerves report heat.', font('sans', 34), (255, 216, 194), 880)
    for i, (label, body) in enumerate([('TRPV1', 'heat receptor'), ('capsaicin', 'pepper molecule'), ('brain signal', 'interpreted as burning')]):
        x = 90 + i * 350
        round_rect(draw, (x, 1190, x + 305, 1370), 34, (255, 246, 236, 230), (255, 190, 145, 160), 2)
        draw_text(draw, (x + 28, 1230), label, font('sansb', 31), (55, 18, 12))
        draw_text(draw, (x + 28, 1284), body, font('sans', 25), (96, 45, 32), 240)
    draw_text(draw, (86, 1605), 'Takeaway: spice is a temperature illusion created by receptors.', font('sansb', 34), (255, 246, 236), 940)
    return image


def sky():
    image = gradient((234, 248, 255), (255, 255, 255))
    draw = ImageDraw.Draw(image)
    draw.ellipse((760, 80, 1080, 400), fill=(255, 218, 98, 190))
    for i in range(9):
        y = 360 + i * 95
        draw.line((880, y, 250, y + 160), fill=(89, 160, 240, 80), width=10)
    for x, y in [(290, 650), (450, 780), (650, 610), (760, 870), (360, 1020), (610, 1120)]:
        draw.ellipse((x - 30, y - 30, x + 30, y + 30), fill=(80, 143, 220, 180))
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(255, 255, 255, 230))
    draw_text(draw, (80, 78), 'Why the sky is blue', font('serifb', 82), (20, 38, 58), 830)
    draw_text(draw, (84, 265), 'Air scatters short blue wavelengths more than red ones, so blue light reaches your eyes from every direction.', font('sans', 33), (70, 92, 112), 930)
    round_rect(draw, (90, 1250, 1110, 1510), 42, (255, 255, 255, 220), (220, 232, 244), 2)
    draw.line((170, 1390, 490, 1390), fill=(80, 143, 220), width=10)
    draw.line((580, 1390, 1000, 1390), fill=(230, 92, 68), width=10)
    draw_text(draw, (170, 1305), 'Blue scatters strongly', font('sansb', 31), (20, 38, 58))
    draw_text(draw, (580, 1305), 'Red travels straighter', font('sansb', 31), (20, 38, 58))
    draw_text(draw, (80, 1625), 'Takeaway: color comes from scattering, not from blue air.', font('sansb', 34), (20, 38, 58), 900)
    return image


def coffee():
    image = gradient((255, 255, 255), (250, 250, 250))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((330, 630, 850, 1010), radius=80, fill=(78, 46, 30), outline=(30, 20, 16), width=8)
    draw.rectangle((390, 560, 790, 670), fill=(230, 230, 230))
    draw.ellipse((380, 520, 800, 700), fill=(244, 244, 244), outline=(55, 42, 36), width=6)
    draw.ellipse((425, 555, 755, 660), fill=(74, 45, 31))
    for x in [470, 580, 700]:
        draw.arc((x, 350, x + 80, 540), 95, 260, fill=(160, 160, 160, 120), width=8)
    nodes = [(220, 1160), (365, 1110), (510, 1200), (670, 1130), (835, 1215), (980, 1140)]
    for a, b in zip(nodes, nodes[1:]):
        draw.line((a, b), fill=(25, 25, 25), width=5)
    for i, (x, y) in enumerate(nodes):
        draw.ellipse((x - 36, y - 36, x + 36, y + 36), fill=(255, 255, 255), outline=(25, 25, 25), width=5)
        draw_text(draw, (x, y - 15), ['C', 'H', 'N', 'O', 'N', 'C'][i], font('sansb', 24), (25, 25, 25), anchor='mm')
    draw_text(draw, (80, 78), 'How caffeine keeps you awake', font('serifb', 73), (20, 20, 20), 940)
    draw_text(draw, (84, 260), 'Caffeine fits into adenosine receptors. It blocks the tiredness signal, so alertness feels higher for a while.', font('sans', 33), (82, 82, 82), 900)
    round_rect(draw, (90, 1320, 1110, 1510), 38, (247, 247, 247), (225, 225, 225), 2)
    draw_text(draw, (135, 1365), 'It does not create energy. It delays the message that says you are tired.', font('sansb', 34), (20, 20, 20), 860)
    draw_text(draw, (80, 1625), 'Takeaway: caffeine is more like a signal blocker than a battery.', font('sansb', 34), (20, 20, 20), 950)
    return image


def petrichor():
    image = gradient((248, 252, 250), (231, 243, 238))
    draw = ImageDraw.Draw(image)
    round_rect(draw, (90, 1050, 1110, 1380), 40, (111, 86, 62), (84, 68, 52), 2)
    for i in range(22):
        x = 120 + i * 46
        y = 1070 + int(40 * math.sin(i))
        draw.ellipse((x, y, x + 70, y + 42), fill=(146, 116, 88, 150))
    for x, y in [(220, 470), (405, 560), (615, 460), (760, 650), (950, 520)]:
        draw.polygon([(x, y - 70), (x - 42, y + 20), (x, y + 70), (x + 42, y + 20)], fill=(80, 150, 210, 135))
        draw.ellipse((x - 42, y - 5, x + 42, y + 78), fill=(80, 150, 210, 135))
    for x, y in [(240, 950), (420, 900), (660, 980), (850, 910)]:
        draw.arc((x - 80, y - 40, x + 80, y + 60), 200, 340, fill=(255, 255, 255, 160), width=8)
    draw_text(draw, (80, 78), 'Why rain smells earthy', font('serifb', 78), (32, 52, 45), 920)
    draw_text(draw, (84, 260), 'Rain hits dry soil and launches tiny aromatic droplets into the air. One key scent is geosmin.', font('sans', 34), (74, 93, 86), 920)
    round_rect(draw, (100, 1420, 1100, 1550), 36, (255, 255, 255, 180), (210, 224, 218), 2)
    draw_text(draw, (145, 1465), 'Petrichor is the smell of soil chemistry becoming airborne.', font('sansb', 34), (32, 52, 45), 820)
    draw_text(draw, (80, 1630), 'Takeaway: the smell is carried by aerosols, not by rainwater itself.', font('sansb', 33), (32, 52, 45), 950)
    return image


def darkmatter():
    image = gradient((9, 12, 26), (26, 21, 55))
    draw = ImageDraw.Draw(image)
    random.seed(4)
    for _ in range(240):
        x = random.randrange(W)
        y = random.randrange(H)
        size = random.choice([1, 1, 2])
        shade = random.randrange(90, 245)
        draw.ellipse((x, y, x + size, y + size), fill=(shade, shade, 255))
    draw.ellipse((230, 520, 970, 1260), outline=(130, 112, 255, 110), width=8)
    draw.arc((200, 650, 1000, 1110), 190, 350, fill=(255, 196, 120, 180), width=28)
    draw.arc((250, 600, 950, 1170), 10, 170, fill=(100, 170, 255, 150), width=18)
    draw.ellipse((520, 790, 680, 950), fill=(255, 230, 170, 210))
    draw.ellipse((558, 828, 642, 912), fill=(30, 24, 55, 200))
    draw_text(draw, (80, 78), 'Why galaxies reveal invisible matter', font('serifb', 72), (248, 248, 255), 930)
    draw_text(draw, (84, 270), 'Stars orbit too fast for visible matter alone. Extra gravity points to mass we cannot see directly.', font('sans', 33), (205, 210, 232), 900)
    for x, label in [(120, 'visible stars'), (455, 'measured speed'), (790, 'missing mass')]:
        round_rect(draw, (x, 1320, x + 285, 1495), 34, (255, 255, 255, 235), (255, 255, 255, 130), 2)
        draw_text(draw, (x + 28, 1365), label, font('sansb', 28), (25, 26, 48), 230)
    draw_text(draw, (80, 1630), 'Takeaway: dark matter is inferred from gravity, not photographed.', font('sansb', 34), (248, 248, 255), 930)
    return image


NEW_ITEMS = [
    ('onion-tears', onion, 'Why onions make you cry', 'Chemistry', 'Onion chemistry', 'Cut onions release sulfur chemistry that irritates your eyes and triggers tears.', 'Enzymes transform sulfur compounds into a volatile eye irritant.', ['Chemistry', 'Biology', 'Senses'], ['plant chemistry', 'sensory irritation']),
    ('chili-heat', chili, 'Why chili feels hot', 'Sensory biology', 'Heat illusion', 'Capsaicin activates a heat receptor, so your brain reads spice as burning.', 'Capsaicin binds TRPV1, a receptor involved in heat and pain signals.', ['Biology', 'Chemistry', 'Senses'], ['neuroscience', 'food chemistry']),
    ('sky-blue', sky, 'Why the sky is blue', 'Atmospheric physics', 'Light scattering', 'Air scatters blue light more strongly, sending blue into your eyes from many directions.', 'Rayleigh scattering favors shorter blue wavelengths over longer red wavelengths.', ['Physics', 'Atmosphere'], ['light', 'atmosphere']),
    ('caffeine-awake', coffee, 'How caffeine keeps you awake', 'Neuroscience', 'Signal blocker', 'Caffeine blocks adenosine, delaying the signal that makes you feel tired.', 'Caffeine competes with adenosine at receptors linked to sleep pressure.', ['Neuroscience', 'Chemistry', 'Biology'], ['brain chemistry', 'receptors']),
    ('rain-smell', petrichor, 'Why rain smells earthy', 'Earth science', 'Petrichor', 'Rain releases tiny scent-carrying droplets from soil into the air.', 'Raindrops aerosolize compounds like geosmin from soil and microbes.', ['Atmosphere', 'Chemistry', 'Biology'], ['soil chemistry', 'aerosols']),
    ('dark-matter', darkmatter, 'Why galaxies reveal invisible matter', 'Space physics', 'Invisible gravity', 'Galaxy motion suggests there is more mass than what telescopes can see.', 'Orbital speeds imply additional gravitational mass around galaxies.', ['Physics', 'Space'], ['gravity', 'cosmology']),
]


def main():
    for slug, renderer, *_ in NEW_ITEMS:
        save_versions(renderer(), slug)

    data_path = ROOT / 'data' / 'items.json'
    data = json.loads(data_path.read_text(encoding='utf-8'))
    slugs = {item[0] for item in NEW_ITEMS}
    data = [item for item in data if item.get('id') not in slugs]

    for slug, _renderer, title, category, hint, takeaway, mechanism, tags, fields in NEW_ITEMS:
        data.append({
            'id': slug,
            'title': title,
            'question': f'{title}?',
            'category': category,
            'tags': tags,
            'hint': hint,
            'takeaway': takeaway,
            'mechanism': mechanism,
            'fields': fields,
            'status': 'Fresh visual draft created in code.',
            'description': 'A self-contained visual explanation designed for quick understanding in the directory grid and a deeper read in the detail view.',
            'alt': f'Infographic explaining {title.lower()}.',
            'images': {
                'thumb': f'assets/images/{slug}-thumb.webp',
                'large': f'assets/images/{slug}-large.webp',
            },
        })
    data_path.write_text(json.dumps(data, indent=2), encoding='utf-8')

    for path in sorted(IMG_DIR.glob('*-thumb.webp')):
        image = Image.open(path)
        print(path.name, image.size, path.stat().st_size)
    print('items', len(data))


if __name__ == '__main__':
    main()
