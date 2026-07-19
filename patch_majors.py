import re

with open('src/components/admin/UsersDataTable.tsx', 'r') as f:
    code = f.read()

# Update program filter options
code = re.sub(
    r'<option value="All">All Majors</option>\s*<option value="Computer Science">Computer Science</option>\s*<option value="Software Engineering">Software Engineering</option>\s*<option value="Data Analytics">Data Analytics</option>\s*<option value="Business Administration">Business Admin</option>\s*<option value="Cybersecurity">Cybersecurity</option>',
    '<option value="All">All Majors</option>\n                <option value="Software Engineering">Software Engineering</option>\n                <option value="Marketing">Marketing</option>\n                <option value="Graphic Design">Graphic Design</option>',
    code
)

# Update new student options
code = re.sub(
    r'<option value="Computer Science">Computer Science</option>\s*<option value="Software Engineering">Software Engineering</option>.*?</select>',
    '<option value="Software Engineering">Software Engineering</option>\n                  <option value="Marketing">Marketing</option>\n                  <option value="Graphic Design">Graphic Design</option>\n                </select>',
    code,
    flags=re.DOTALL
)

# Also initial state for newProgram
code = code.replace("useState('Computer Science')", "useState('Software Engineering')")

with open('src/components/admin/UsersDataTable.tsx', 'w') as f:
    f.write(code)
