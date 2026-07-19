with open('src/components/admin/DualPanelAllocation.tsx', 'r') as f:
    lines = f.readlines()

out = []
found_import = False
for line in lines:
    if "import { useAppStore }" in line:
        if found_import:
            continue
        found_import = True
    out.append(line)

with open('src/components/admin/DualPanelAllocation.tsx', 'w') as f:
    f.writelines(out)

