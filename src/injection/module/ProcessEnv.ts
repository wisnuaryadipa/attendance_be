export {};

declare global
{
    namespace NodeJS
    {
        export interface ProcessEnv
        {
            NODE_ENV: "development" | "production" | "test";
            MY_API_KEY?: string
            DB_USER?: string
        }
    }
}