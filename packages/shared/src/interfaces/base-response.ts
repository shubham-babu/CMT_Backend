export interface IBaseResponse<T extends Record<string, any>> {
    statusCode?: number;
    message: string;
    data?: T;
}