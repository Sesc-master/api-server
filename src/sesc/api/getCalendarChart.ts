import parseCalendarChart from "../parsers/parseCalendarChart";
import Timing from "../types/timings";
import parseLessonsTimings from "../parsers/parseLessonsTimings";
import SESCRequest from "../request";
import CalendarChart from "../../api/types/calendarChart";

export type CalendarCharts = {
    calendarChart: CalendarChart, lessonsTimings: Array<Timing>
}

export default async function getCalendarChart (): Promise<CalendarCharts> {
    console.log(`${new Date().toString()} called getCalendarChart`);
    return SESCRequest("https://lyceum.urfu.ru/fileadmin/user_upload/scripts/zvonkiCalGraf.js")
        .then(script => {
            return {
                calendarChart: parseCalendarChart(script),
                lessonsTimings: parseLessonsTimings(script)
            }
        });
}