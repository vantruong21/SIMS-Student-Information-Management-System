import re

with open('src/store/useAttendanceStore.ts', 'r') as f:
    code = f.read()

code = code.replace(
    "import { create } from 'zustand';",
    "import { create } from 'zustand';\nimport { useAuthStore } from './useAuthStore';"
)

code = re.sub(
    r"        studentName: 'Sarah Jenkins', // Hardcoded as the demo student",
    "        studentName: useAuthStore.getState().currentUser?.name || 'Unknown Student',",
    code
)

code = re.sub(
    r"        studentEmail: 'sarah\.jenkins@elevate\.edu',",
    "        studentEmail: useAuthStore.getState().currentUser?.email || 'unknown@elevate.edu',",
    code
)

with open('src/store/useAttendanceStore.ts', 'w') as f:
    f.write(code)

