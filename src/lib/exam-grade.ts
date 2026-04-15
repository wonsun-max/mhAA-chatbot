export function normalizeGradeLabel(value?: string): string {
    if (!value) return "";

    return value
        .toLowerCase()
        .replace(/[–—]/g, "-")
        .replace(/\b(grades?|class)\b/g, "")
        .replace(/학년|반/g, "")
        .replace(/\s+/g, "");
}

export function extractGradeKeys(value?: string): Set<string> {
    const keys = new Set<string>();
    const normalized = normalizeGradeLabel(value);

    if (!normalized) {
        return keys;
    }

    const segments = normalized
        .split(/,|\/|&|\+|및|and/gi)
        .map((segment) => segment.trim())
        .filter(Boolean);

    for (const segment of segments) {
        if (["all", "전체", "전학년", "공통"].includes(segment)) {
            keys.add("*");
            continue;
        }

        const rangeMatch = segment.match(/^(\d{1,2})\s*(?:-|~|to)\s*(\d{1,2})$/);
        if (rangeMatch) {
            const start = Number(rangeMatch[1]);
            const end = Number(rangeMatch[2]);

            if (start <= end) {
                for (let current = start; current <= end; current += 1) {
                    keys.add(String(current));
                }
                continue;
            }
        }

        keys.add(segment);

        const baseGrade = segment.match(/\d{1,2}/)?.[0];
        if (baseGrade) {
            keys.add(baseGrade);
        }
    }

    return keys;
}

export function matchesExamGrade(queryGrade: string, recordGrades: string[]): boolean {
    const queryKeys = extractGradeKeys(queryGrade);
    if (queryKeys.size === 0) {
        return true;
    }

    return recordGrades.some((gradeLabel) => {
        const recordKeys = extractGradeKeys(gradeLabel);

        if (recordKeys.has("*")) {
            return true;
        }

        return Array.from(queryKeys).some((key) => recordKeys.has(key));
    });
}

export function simplifyGradeLabel(value?: string): string {
    const normalized = normalizeGradeLabel(value);
    return normalized.match(/\d{1,2}/)?.[0] ?? "";
}
