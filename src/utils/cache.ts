import ICache from "./ICache";
import {isEqual} from "lodash";

export default class Cache<T> implements ICache<T> {
    protected data!: T;

    public async getValue(): Promise<T> {
        return new Promise<T>(resolve => resolve(this.data));
    }

    public async updateValue(newValue: T): Promise<boolean> {
        let isChanged = !isEqual(this.data, newValue);
        if (isChanged) this.data = newValue;
        return new Promise<boolean>(resolve => resolve(isChanged));
    }
}