var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/locales/zh-CN.yml
var require_zh_CN = __commonJS({
  "src/locales/zh-CN.yml"(exports2, module2) {
    module2.exports = { commands: { exec: { description: "执行命令", messages: { "expect-input": "请输入要运行的命令。", started: "[运行开始] {command}", finished: "[运行完毕] {command}\n{output}", "no-permission": "你没有权限执行此命令。" } } } };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_child_process = require("child_process");
var import_koishi = require("koishi");
var import_path = __toESM(require("path"));
var encodings = ["utf8", "utf16le", "latin1", "ucs2"];
var Config = import_koishi.Schema.object({
  root: import_koishi.Schema.string().description("工作路径。").default(""),
  shell: import_koishi.Schema.string().description("运行命令的程序。"),
  encoding: import_koishi.Schema.union(encodings).description("输出内容编码。").default("utf8"),
  timeout: import_koishi.Schema.number().description("最长运行时间。").default(import_koishi.Time.minute),
  groupManagerPermission: import_koishi.Schema.boolean().description("开启后，群主或管理员可以执行任何指令。").default(false),
  permissionMap: import_koishi.Schema.array(import_koishi.Schema.object({
    userId: import_koishi.Schema.string().description("用户ID"),
    allowedCommands: import_koishi.Schema.array(import_koishi.Schema.string()).description("允许调用的指令。全部允许请填入“all”。")
  })).description("权限映射表。")
});
var name = "spawn";
function apply(ctx, config) {
  ctx.i18n.define("zh-CN", require_zh_CN());
  function isAdmin(session) {
    const sessionRoles = session.event.member.roles;
    return sessionRoles && (sessionRoles.includes("admin") || sessionRoles.includes("owner"));
  }
  __name(isAdmin, "isAdmin");
  function checkUserPermission(session, command, config2) {
    const userId = session.userId;
    if (config2.groupManagerPermission && isAdmin(session)) {
      return true;
    }
    const permissionEntry = config2.permissionMap?.find((entry) => entry.userId === userId);
    if (permissionEntry) {
      const allowedCommands = permissionEntry.allowedCommands;
      if (allowedCommands.includes("all")) {
        return true;
      }
      if (allowedCommands.some((cmd) => command.startsWith(cmd))) {
        return true;
      }
    }
    return false;
  }
  __name(checkUserPermission, "checkUserPermission");
  ctx.command("exec <command:text>", { authority: 1 }).action(async ({ session }, command) => {
    if (!command) return session.text(".expect-text");
    command = (0, import_koishi.h)("", import_koishi.h.parse(command)).toString(true);
    if (!checkUserPermission(session, command, config)) {
      return session.text(".no-permission", { command });
    }
    const { timeout } = config;
    const state = { command, timeout, output: "" };
    await session.send(session.text(".started", state));
    return new Promise((resolve) => {
      const start = Date.now();
      const child = (0, import_child_process.exec)(command, {
        timeout,
        cwd: import_path.default.resolve(ctx.baseDir, config.root),
        encoding: config.encoding,
        shell: config.shell,
        windowsHide: true
      });
      child.stdout.on("data", (data) => {
        state.output += data.toString();
      });
      child.stderr.on("data", (data) => {
        state.output += data.toString();
      });
      child.on("close", (code, signal) => {
        state.code = code;
        state.signal = signal;
        state.timeUsed = Date.now() - start;
        state.output = state.output.trim();
        resolve(session.text(".finished", state));
      });
    });
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
