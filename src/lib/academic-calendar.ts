import { toManilaTime } from "./utils";

/**
 * Computes the school academic year in Asia/Manila time.
 * Months Jan-Feb belong to the previous academic year.
 */
export function getAcademicYear(date = toManilaTime()): number {
    const month = date.getMonth() + 1;
    return month <= 2 ? date.getFullYear() - 1 : date.getFullYear();
}

/**
 * Computes the current academic semester ("1" or "2") in Asia/Manila time.
 */
export function getAcademicSemester(date = toManilaTime()): "1" | "2" {
    const month = date.getMonth() + 1;
    return month >= 8 || month <= 2 ? "2" : "1";
}
