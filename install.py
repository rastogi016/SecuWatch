import os
import sys
import subprocess
import shutil
from pathlib import Path


def exit_with_error(message):
    print(f"\n {message}")
    sys.exit(1)


def run_command(command, cwd=None):
    try:
        subprocess.check_call(command, shell=True, cwd=cwd)
    except subprocess.CalledProcessError:
        exit_with_error(f"Command failed: {command}")


def check_command_exists(command):
    return shutil.which(command) is not None


def main():
    print(" Starting SecuWatch installation...")

    # 1. Check Python
    if not check_command_exists("python") and not check_command_exists("python3"):
        exit_with_error("Python is not installed. Please install Python 3.")

    python_exec = shutil.which("python3") or shutil.which("python")

    # 2. Check virtualenv
    print(" Checking for virtualenv...")
    try:
        subprocess.check_output([python_exec, "-m", "virtualenv", "--version"])
    except subprocess.CalledProcessError:
        print(" Installing virtualenv...")
        run_command(f"{python_exec} -m pip install virtualenv")

    # 3. Create virtual environment
    print(" Creating virtual environment...")
    run_command(f"{python_exec} -m virtualenv venv")

    # 4. Activate and install backend requirements
    print(" Installing backend requirements...")
    venv_bin = (
        "venv\\Scripts\\activate" if os.name == "nt" else "source venv/bin/activate"
    )
    pip_exec = "venv\\Scripts\\pip" if os.name == "nt" else "venv/bin/pip"

    if not os.path.exists("requirements.txt"):
        exit_with_error("Missing requirements.txt file.")
    run_command(f"{pip_exec} install -r requirements.txt")

    # 5. Check for Node.js and npm
    print(" Checking for Node.js and npm...")
    if not check_command_exists("node"):
        exit_with_error(
            "Node.js is not installed. Please install it from https://nodejs.org/"
        )
    if not check_command_exists("npm"):
        exit_with_error(
            "npm is not installed. Please install Node.js (npm is included)."
        )

    # 6. Install frontend dependencies
    frontend_dir = Path("frontend")

    if not frontend_dir.exists():
        exit_with_error("Frontend directory not found.")
    print(" Installing frontend dependencies...")
    run_command("npm install", cwd=str(frontend_dir))

    print("\n All dependencies installed successfully!")


if __name__ == "__main__":
    main()
