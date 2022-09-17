import getIDs from "../../sesc/api/getIDs";
import getCalendarChart, {CalendarCharts} from "../../sesc/api/getCalendarChart";
import getAnnouncements from "../../sesc/api/getAnnouncements";
import {FullSchedule} from "../../sesc/types/fullSchedule";
import getSchedule, {ScheduleType, scheduleTypes} from "../../sesc/api/getSchedule";
import Schedule from "../../sesc/types/schedule";
import {IDsRecords} from "../../sesc/parsers/parseIDs";
import getFullSchedule from "../../sesc/api/getFullSchedule";
import getEatTimings from "../../sesc/api/getEatTimings";
import { env } from "node:process";

export {getIDs, getCalendarChart, getAnnouncements};

const scheduleTypeDelay = parseInt(env.SCHEDULE_TYPE_DELAY ?? "10000"),
    weekdayDelay = parseInt(env.WEEKDAY_DELAY ?? "10000");

    export type Schedules = {
    fullSchedules: Map<number, FullSchedule>,
    schedules: Map<ScheduleType, Map<number, Map<number, Schedule>>>
}

export async function getSchedules (IDs: IDsRecords) {
    console.log(`${new Date().toString()} called getSchedules`);

    let result: Schedules = {fullSchedules: new Map(), schedules: new Map()};
    let requests = new Array<Promise<any>>();

    for (const weekdayID of IDs.weekday.values()) {
        requests.push(getFullSchedule(weekdayID).then(weekFullSchedule => result.fullSchedules.set(weekdayID, weekFullSchedule)));
        for (const scheduleType of scheduleTypes) {
            for (const targetID of IDs[scheduleType].values()) {
                requests.push(getSchedule(scheduleType, targetID, weekdayID).then(schedule => {
                    if (!result.schedules.has(scheduleType)) result.schedules.set(scheduleType, new Map());
                    if (!result.schedules.get(scheduleType)?.has(targetID)) result.schedules.get(scheduleType)?.set(targetID, new Map());
                    result.schedules.get(scheduleType)?.get(targetID)?.set(weekdayID, schedule);
                }));
            }
            if (scheduleType !== scheduleTypes[scheduleTypes.length - 1]) await new Promise<void>(resolve => setTimeout(resolve, scheduleTypeDelay));
        }
        await new Promise<void>(resolve => setTimeout(resolve, weekdayDelay));
    }

    await Promise.all(requests);
    return result;
}

export async function updater_getEatTimings (calendarCharts: CalendarCharts) {
    console.log(`${new Date().toString()} called getEatTimings`);

    return getEatTimings(calendarCharts.lessonsTimings);
}