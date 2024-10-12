
export function getEntries<T>(obj: ArrayLike<T> | Record<string, T>, alphabetize?: boolean) {
    let entries = Object.entries(obj);

    if(alphabetize) {
        entries.sort(([a], [b]) => a.localeCompare(b, "en-us", { numeric: true }));
    }

    return  entries
}


export function resolveRef<T> ( schema: any, ref: string): T | undefined {
   
}