import { Context, Schema } from 'koishi';
declare const encodings: readonly ["utf8", "utf16le", "latin1", "ucs2"];
export interface Config {
    root?: string;
    shell?: string;
    encoding?: typeof encodings[number];
    timeout?: number;
    groupManagerPermission?: boolean;
    permissionMap?: {
        userId: string;
        allowedCommands: string[];
    }[];
}
export declare const Config: Schema<Config>;
export interface State {
    command: string;
    timeout: number;
    output: string;
    code?: number;
    signal?: NodeJS.Signals;
    timeUsed?: number;
}
export declare const name = "spawn";
export declare function apply(ctx: Context, config: Config): void;
export {};
/**
 * bug list
 * Windows GBK编码下 中文乱码
 *
 */
