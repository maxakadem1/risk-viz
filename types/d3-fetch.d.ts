declare module "d3-fetch" {
  export type DSVRowArray<T> = Array<DSVRowString<T>>;

  // add any other types you need to use from the d3-fetch module
  // export csv
  export function csv<T>(
    url: string,
    row: (d: any) => T
  ): Promise<DSVRowArray<T>>;
}
