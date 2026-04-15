export function getAcademicYear(date = new Date()): number {
    const month = date.getMonth() + 1;
    return month <= 2 ? date.getFullYear() - 1 : date.getFullYear();
}

export function getAcademicSemester(date = new Date()): "1" | "2" {
    const month = date.getMonth() + 1;
    return month >= 8 || month <= 2 ? "2" : "1";
}
