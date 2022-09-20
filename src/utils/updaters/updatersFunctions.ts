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
import RequestsPull from "../requestsPull";

export {getIDs, getCalendarChart, getAnnouncements};

const scheduleTypeDelay = env.SCHEDULES_TYPE_DELAY ? parseInt(env.SCHEDULES_TYPE_DELAY) : undefined,
    weekdayDelay = env.SCHEDULES_WEEKDAY_DELAY ? parseInt(env.SCHEDULES_WEEKDAY_DELAY) : undefined;

export type Schedules = {
    fullSchedules: Map<number, FullSchedule>,
    schedules: Map<ScheduleType, Map<number, Map<number, Schedule>>>
}

export async function getSchedules (IDs: IDsRecords) {
    console.log(`${new Date().toString()} called getSchedules`);

    let result: Schedules = {fullSchedules: new Map(), schedules: new Map()};
    const requestsPull = new RequestsPull(parseInt(env.SCHEDULES_MAX_PARALLEL_REQUESTS ?? "10"));

    for (const weekdayID of IDs.weekday.values()) {
        await requestsPull.request(getFullSchedule(weekdayID).then(weekFullSchedule => result.fullSchedules.set(weekdayID, weekFullSchedule)));
        for (const scheduleType of scheduleTypes) {
            for (const targetID of IDs[scheduleType].values()) {
                await requestsPull.request(getSchedule(scheduleType, targetID, weekdayID).then(schedule => {
                    if (!result.schedules.has(scheduleType)) result.schedules.set(scheduleType, new Map());
                    if (!result.schedules.get(scheduleType)?.has(targetID)) result.schedules.get(scheduleType)?.set(targetID, new Map());
                    result.schedules.get(scheduleType)?.get(targetID)?.set(weekdayID, schedule);
                }));
            }

            if (scheduleTypeDelay && scheduleType !== scheduleTypes[scheduleTypes.length - 1]) {
                await new Promise<void>(resolve => setTimeout(resolve, scheduleTypeDelay));
            }
        }
        if (weekdayDelay) {
            await new Promise<void>(resolve => setTimeout(resolve, weekdayDelay));
        }
    }

    await requestsPull.awaitRequests();
    return result;
}

export async function updater_getEatTimings (calendarCharts: CalendarCharts) {
    console.log(`${new Date().toString()} called getEatTimings`);

    return getEatTimings(calendarCharts.lessonsTimings);
}