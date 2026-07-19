import re

with open('src/mockData.ts', 'r') as f:
    code = f.read()

code = code.replace("name: 'John Doe',", "id: 'stu-1',\n  name: 'John Doe',")
code = code.replace("name: 'GS. Tran Hoang',", "id: 'admin-1',\n  name: 'GS. Tran Hoang',")
code = code.replace("name: 'Richard Feynman',", "id: 'fac-1',\n  name: 'Richard Feynman',")

with open('src/mockData.ts', 'w') as f:
    f.write(code)
