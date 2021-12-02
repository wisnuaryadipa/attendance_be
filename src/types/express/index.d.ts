export {};

declare global {
    namespace Express {
        export interface Request {
          currentUser: string;
        }    

        export type Nullable<T> = T | undefined | null;
      }
}