import { Schema } from 'koishi';
export declare const name = "awa-awa";
export declare const usage = "\n\u8FD9\u4E2A\u63D2\u4EF6\u662F\u7528\u6765\u5B9E\u73B0\u5173\u952E\u8BCD\u56DE\u590D\u7684\u63D2\u4EF6\u54E6~\n\n\u53EF\u4EE5\u6839\u636E\u7FA4\u7EC4ID\u6765\u914D\u7F6E\u5173\u952E\u8BCD\u56DE\u590D\uFF0C\u4E5F\u53EF\u4EE5\u914D\u7F6E\u5168\u5C40\u7684\u5173\u952E\u8BCD\u56DE\u590D\u54E6~\n";
export declare const Config: Schema<Schemastery.ObjectS<{
    table2: Schema<Schemastery.ObjectS<{
        keyword: Schema<string, string>;
        enable_exp: Schema<boolean, boolean>;
        callback_messgae: Schema<string, string>;
        channelId: Schema<string, string>;
    }>[], Schemastery.ObjectT<{
        keyword: Schema<string, string>;
        enable_exp: Schema<boolean, boolean>;
        callback_messgae: Schema<string, string>;
        channelId: Schema<string, string>;
    }>[]>;
}> | Schemastery.ObjectS<{
    enable_true_middleware: Schema<boolean, boolean>;
    enable_loggerinfo: Schema<boolean, boolean>;
}>, {
    table2: Schemastery.ObjectT<{
        keyword: Schema<string, string>;
        enable_exp: Schema<boolean, boolean>;
        callback_messgae: Schema<string, string>;
        channelId: Schema<string, string>;
    }>[];
} & import("cosmokit").Dict & {
    enable_true_middleware: boolean;
    enable_loggerinfo: boolean;
}>;
export declare function apply(ctx: any, config: any): void;
