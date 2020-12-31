export = buildFetch;
/**
 * `buildFetch` returns the undici-fetch client that is used like a standard WHATWG fetch client. The client reuses Undici.Pool instances for every unique request url origin. The pools are memoized as the client instance is used so that subsequent calls to the same origin are faster.
 *
 * For now, you **must** call `.close()` on the fetch instance in order to prevent memory leaks. This method iterates through the pool Map and closes all of them in parallel. This will be removed in v1 after an auto-close feature is implemented.
 */
declare function buildFetch(...args: any[]): {
    (resource: string | Request, init?: {
        signal?: AbortSignal | undefined;
    } & Request.RequestInit): Promise<Response>;
    /**
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
};
import Request = require("./request");
import Response = require("./response");
