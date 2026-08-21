/**
 * Formats a date string (YYYY-MM-DD or ISO) into YYYYMMDD string for iCalendar / Google Calendar.
 */
function formatDateToIcs(dateStr: string, isEnd = false): string {
    const cleanDate = dateStr.replace(/[^0-9-]/g, "").split("-");
    if (cleanDate.length === 3) {
        const year = cleanDate[0];
        const month = cleanDate[1].padStart(2, "0");
        let day = parseInt(cleanDate[2]);
        if (isEnd) {
            // For all-day events in ICS/Google, end date is exclusive (day + 1)
            day += 1;
        }
        return `${year}${month}${String(day).padStart(2, "0")}`;
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
 * Generates valid iCalendar (.ics) string for importing into Google / Apple / Outlook Calendar.
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
 */
export function downloadIcsFile(filename: string, content: string) {
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
