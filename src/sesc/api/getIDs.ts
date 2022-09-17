import SESCRequest from "../request";
import { parse } from "node-html-parser";
import ParseIDs, {IDsRecords} from "../parsers/parseIDs";

export default async function getIDs (): Promise<IDsRecords> {
    console.log(`${new Date().toString()} called getIDs`);
    return SESCRequest("https://lyceum.urfu.ru/ucheba/raspisanie-zanjatii")
        .then(pageBody => parse(pageBody))
        .then(ParseIDs);
}
