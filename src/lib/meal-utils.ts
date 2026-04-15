/**
 * Utility functions for school meal order logic.
 */

export const GROUP_1 = "7, 9, 11";
export const GROUP_2 = "8, 10, 12-1, 12-2";

/**
 * Calculates the meal order for a given date.
 * Based on the reference date 2026-03-16 (Monday).
 * 
 * Rules:
 * - Groups swap priority every week.
 * - Within a week, priority days (Mon, Wed, Fri) favor the "base" group of that week.
 * - Non-priority days (Tue, Thu) favor the other group.
 * 
 * @param date The date to calculate for.
 * @returns { firstGroup: string, secondGroup: string } | null if it's a weekend.
 */
export function getMealOrder(date: Date) {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    if (day === 0 || day === 6) return null;

    // Reference Monday: 2026-03-16
    const refDate = new Date("2026-03-16");
    
    // Calculate difference in weeks
    // Reset hours to midnight for accurate calculation
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    const start = new Date(refDate);
    start.setHours(0, 0, 0, 0);
    
    // Find the Monday of the current week to calculate week difference
    const currentMondayDiff = (day === 0 ? -6 : 1 - day);
    const currentMonday = new Date(current);
    currentMonday.setDate(current.getDate() + currentMondayDiff);
    
    const weekDiffTime = currentMonday.getTime() - start.getTime();
    const diffWeeks = Math.round(weekDiffTime / (1000 * 60 * 60 * 24 * 7));

    // Swap base priority every week
    const isGroup1BaseWeek = diffWeeks % 2 === 0;

    // Based on user: Ref week (Mar 16), day 1, 3, 5 are Group 1 priority.
    // day 2, 4 are Group 2 priority.
    const isPriorityDay = (day % 2) !== 0; // Mon(1), Wed(3), Fri(5)

    let firstGroup, secondGroup;
    if (isGroup1BaseWeek) {
        firstGroup = isPriorityDay ? GROUP_1 : GROUP_2;
        secondGroup = isPriorityDay ? GROUP_2 : GROUP_1;
    } else {
        // Next week, swap
        firstGroup = isPriorityDay ? GROUP_2 : GROUP_1;
        secondGroup = isPriorityDay ? GROUP_1 : GROUP_2;
    }

    return { firstGroup, secondGroup };
}
