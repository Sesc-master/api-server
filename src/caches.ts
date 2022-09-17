import Cache from "./utils/cache";
import {CalendarCharts} from "./sesc/api/getCalendarChart";
import {IDsRecords} from "./sesc/parsers/parseIDs";
import Announcement from "./sesc/types/announcement";
import {Schedules} from "./utils/updaters/updatersFunctions";
import {ClassesEatTimings} from "./sesc/parsers/parseEatTimings";

export const calendarChartsCache = new Cache<CalendarCharts>();
export const IDsRecordsCache = new Cache<IDsRecords>();
export const announcementsCache = new Cache<Array<Announcement>>();
export const schedulesCache = new Cache<Schedules>();
export const eatTimingsCache = new Cache<ClassesEatTimings>();