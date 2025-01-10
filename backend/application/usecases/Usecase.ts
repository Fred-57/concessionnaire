export interface Usecase {
    execute(...args: any[]): Promise<void>;
}