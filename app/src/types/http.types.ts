export interface ResponseError {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
}

export interface ResponseSuccess<T = any> {
    statusCode: number;
    data: T;
}
