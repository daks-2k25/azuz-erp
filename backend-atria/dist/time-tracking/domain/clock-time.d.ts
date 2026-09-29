export declare const MINUTES_PER_HOUR = 60;
export declare const MINUTES_PER_DAY: number;
export declare const CLOCK_TIME_PATTERN: RegExp;
export declare function isValidClockTime(value: string): boolean;
export declare function clockTimeToMinutes(value: string): number;
export declare function minutesToClockTime(totalMinutes: number): string;
