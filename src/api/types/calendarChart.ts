import DatesRange from "../../sesc/types/datesRange";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
export default class CalendarChart {
    @Field(type => [DatesRange])
    public readonly quarters!: Array<DatesRange>;
    @Field(type => [DatesRange])
    public readonly holidays!: Array<DatesRange>;
    @Field(type => [DatesRange])
    public readonly sessions!: Array<DatesRange>;
}