import pyfiglet
from termcolor import colored
import random
import shutil


def bannerSecuWatch():
    # Get terminal width for centering
    term_width = shutil.get_terminal_size().columns

    # Random color
    colors = ["red", "green", "yellow", "blue", "magenta", "cyan", "white"]
    color = random.choice(colors)

    sub_color = random.choice(colors)

    # Title banner
    banner = pyfiglet.figlet_format("SecuWatch", font="slant")
    for line in banner.splitlines():
        print(colored(line.center(term_width), color, attrs=["bold"]))

    # Subtext (tagline, version, by ThreatSage)
    tagline = "Real-Time Threat Detection"
    version = "Version 1.0"
    byline = "by ThreatSage"

    for text in [tagline, version, byline]:
        print(colored(text.center(term_width), sub_color, attrs=["bold"]))
