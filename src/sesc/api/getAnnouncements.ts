import SESCRequest from "../request";
import {parse} from "node-html-parser";
import parseAnnouncements from "../parsers/parseAnnouncements";

export default async function getAnnouncements() {
    console.log(`${new Date().toString()} called getAnnouncements`);
    return SESCRequest("https://lyceum.urfu.ru/dopolnitelnye-stranicy/objavlenija")
        .then(pageBody => parse(pageBody))
        .then(parseAnnouncements);
}