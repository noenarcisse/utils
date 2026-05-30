import sys
import os.path
from pathlib import Path


#meeeeeeh
#for later
args = sys.argv

baseLink = "https://github.com/noenarcisse/utils/tree/main/"
folder = "FeeFarp/"

p = Path(".")
# all_files = list(p.glob("**/*"))
all_files = list(p.glob("*"))

negate = lambda f : (lambda x:  not f(x))
listdir = lambda f : f.is_dir()

files = list(filter(negate(listdir), all_files))
dirs = list(filter(listdir, all_files))

print("FILES:")
for f in files :
    print(f)
    
print("\nDIRS: ")
for d in dirs :
    print(d)