/**
 * Utility functions for exporting academic events and meals to Google Calendar
 * and RFC 5545 compliant iCalendar (.ics) files.
 */

/**
 * Formats a date string (YYYY-MM-DD) into YYYYMMDD string for iCalendar / Google Calendar.
 * Uses UTC Date arithmetic to ensure accurate month/year rollover on exclusive end dates.
 *
 * @param dateStr - Date formatted as YYYY-MM-DD
 * @param isEnd - Whether this is an end date (requires +1 day offset for all-day events)
 * @returns Formatted date string (YYYYMMDD)
 */
function formatDateToIcs(dateStr: string, isEnd = false): string {
    const cleanDate = dateStr.replace(/[^0-9-]/g, "").split("-");
    if (cleanDate.length === 3) {
        const year = parseInt(cleanDate[0], 10);
        const monthIndex = parseInt(cleanDate[1], 10) - 1;
        const day = parseInt(cleanDate[2], 10);

        const d = new Date(Date.UTC(year, monthIndex, day));
        if (isEnd) {
            // For all-day events in RFC 5545 / Google Calendar, DTEND is exclusive
            d.setUTCDate(d.getUTCDate() + 1);
        }

        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const dateNum = String(d.getUTCDate()).padStart(2, "0");
        return `${y}${m}${dateNum}`;
    }
    return dateStr.replace(/-/g, "");
}

export interface CalendarExportItem {
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
}

/**
 * Generates a direct Google Calendar Web URL to add an event with 1 click.
 *
 * @param item - Event details including title, date range, description, location
 * @returns Direct Google Calendar render URL
 */
export function getGoogleCalendarEventUrl(item: {
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
}): string {
    const start = formatDateToIcs(item.startDate);
    const end = item.endDate ? formatDateToIcs(item.endDate, true) : formatDateToIcs(item.startDate, true);

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: item.title,
        dates: `${start}/${end}`,
    });

    if (item.description) {
        params.set("details", item.description);
    }
    if (item.location) {
        params.set("location", item.location);
    }

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates valid iCalendar (.ics) string conforming to RFC 5545 for importing into
 * Google Calendar, Apple Calendar, Samsung Calendar, and Outlook.
 *
 * @param calendarName - Name of the calendar feed
 * @param items - Array of calendar items to include
 * @returns RFC 5545 formatted .ics string
 */
export function generateIcsContent(
    calendarName: string,
    items: CalendarExportItem[]
): string {
    const lines: string[] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//WITHUS//MHA Academic Calendar//KO",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        `X-WR-CALNAME:${calendarName}`,
        "X-WR-TIMEZONE:Asia/Manila",
    ];

    items.forEach((item) => {
        const start = formatDateToIcs(item.startDate);
        const end = item.endDate ? formatDateToIcs(item.endDate, true) : formatDateToIcs(item.startDate, true);
        const uid = `${item.id || Math.random().toString(36).substring(2)}@mhawithus.shop`;

        lines.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART;VALUE=DATE:${start}`,
            `DTEND;VALUE=DATE:${end}`,
            `SUMMARY:${item.title.replace(/,/g, "\\,")}`,
            `DESCRIPTION:${(item.description || "마닐라한국아카데미 WITHUS").replace(/\n/g, "\\n")}`,
            `LOCATION:${(item.location || "마닐라한국아카데미").replace(/,/g, "\\,")}`,
            "STATUS:CONFIRMED",
            "END:VEVENT"
        );
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
}

/**
 * Triggers a browser download for a .ics calendar file.
 *
 * @param filename - Target filename (e.g. 'mha-calendar.ics')
 * @param content - RFC 5545 formatted .ics string
 */
export function downloadIcsFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename.endsWith(".ics") ? filename : `${filename}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
