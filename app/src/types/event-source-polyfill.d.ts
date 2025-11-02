declare module 'event-source-polyfill' {
  export interface EventSourcePolyfillInit {
    withCredentials?: boolean;
    headers?: Record<string, string>;
  }

  export class EventSourcePolyfill extends EventSource {
    constructor(url: string, eventSourceInitDict?: EventSourcePolyfillInit);
  }
}

