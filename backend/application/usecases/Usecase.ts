export interface Usecase<T> {
  execute(...args: any[]): Promise<void | T>;
}
