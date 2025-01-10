var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name,
  usage: () => usage
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");
var name = "awa-awa";
var usage = `
这个插件是用来实现关键词回复的插件哦~

可以根据群组ID来配置关键词回复，也可以配置全局的关键词回复哦~
`;
var Config = import_koishi.Schema.intersect([
  import_koishi.Schema.object({
    table2: import_koishi.Schema.array(import_koishi.Schema.object({
      keyword: import_koishi.Schema.string().description("可以触发回复的关键词"),
      // enable_exp: Schema.boolean().default(false).description("开启后，包含关键词即可触发。默认： 关键词完全一致时 才回复"),
      enable_exp: import_koishi.Schema.boolean().default(false).description("false:严格等于； true:包含子串"),
      callback_messgae: import_koishi.Schema.string().description("回复的内容"),
      channelId: import_koishi.Schema.string().description("生效的群组ID。如果你需要应用到全局，请填入“all”")
    })).role("table").description("关键词回复--群组  ---- 映射表")
  }).description("关键词回复配置"),
  import_koishi.Schema.object({
    enable_true_middleware: import_koishi.Schema.boolean().default(false).description("使用前置中间件匹配模式<br>用于防止中间件阻塞等"),
    enable_loggerinfo: import_koishi.Schema.boolean().default(false).description("启用日志调试模式<br>日常使用无需开启")
  }).description("调试设置")
]);
function apply(ctx, config) {
  const logmessage = /* @__PURE__ */ __name((message) => {
    if (config.enable_loggerinfo) {
      ctx.logger.info(message);
    }
  }, "logmessage");
  ctx.middleware(async (session, next) => {
    const channels = config.table2.filter((item) => item.channelId === session.channelId || item.channelId === "all");
    if (channels && channels.length > 0) {
      for (const channel of channels) {
        const { keyword, enable_exp, callback_messgae } = channel;
        const isMatched = enable_exp ? session.content.includes(keyword) : session.content === keyword;
        if (isMatched) {
          logmessage(`
群组${session.channelId} - ${session.username || session.userId} 触发关键词：${keyword}
回复内容：${callback_messgae}`);
          await session.send(callback_messgae);
        }
      }
    }
    return next();
  }, config.enable_true_middleware);
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name,
  usage
});
