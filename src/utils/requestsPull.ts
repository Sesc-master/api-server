export default class RequestsPull {
    private requests: Array<Promise<any>>;

    constructor(
        public readonly maxRequests: number
    ) {
        if (this.maxRequests <= 0) this.maxRequests = 1;
        this.requests = new Array<Promise<any>>();
    }

    public awaitRequests(): Promise<void> {
        return Promise.all(this.requests).then(() => {this.requests = new Array<Promise<any>>()});
    };

    public async request(request: Promise<any>): Promise<void> {
        this.requests.push(request);

        if (this.requests.length >= this.maxRequests) return this.awaitRequests();
        else return new Promise<void>(resolve => resolve(void 0));
    }
}