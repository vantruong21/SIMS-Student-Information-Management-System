import re

with open('src/types.ts', 'r') as f:
    code = f.read()

# Fix duplicates
code = re.sub(r'  id: string;\n  id: string;', '  id: string;', code)
code = re.sub(r'  id: string;\n  code: string;\n  id: string;', '  id: string;\n  code: string;', code)

with open('src/types.ts', 'w') as f:
    f.write(code)

