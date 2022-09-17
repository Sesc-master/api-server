import {ScheduleType} from "../api/getSchedule";
import {Lesson} from "./lesson";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
export default class Schedule {
    @Field(type => String)
    public readonly type: ScheduleType;
    @Field(type => [Lesson])
    public readonly lessons: Array<Lesson>;
    @Field(type => [Lesson])
    public readonly diffs: Array<Lesson>;

    constructor(type: ScheduleType, lessons: Array<Lesson>, diffs: Array<Lesson>) {
        this.type = type;
        this.lessons = lessons;
        this.diffs = diffs;
    }
}