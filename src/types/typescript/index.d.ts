export {};

declare global {
    namespace Typescript {
        export interface Error  {
            status?: number
        }
    }
}