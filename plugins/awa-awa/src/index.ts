import { Context, Schema, h } from 'koishi'

export const name = 'awa-awa'

export const usage = `
这个插件是用来实现关键词回复的插件哦~

可以根据群组ID来配置关键词回复，也可以配置全局的关键词回复哦~
`



export const Config =
  Schema.intersect([
    Schema.object({
      table2: Schema.array(Schema.object({
        keyword: Schema.string().description("可以触发回复的关键词"),
        // enable_exp: Schema.boolean().default(false).description("开启后，包含关键词即可触发。默认： 关键词完全一致时 才回复"),
        enable_exp: Schema.boolean().default(false).description("false:严格等于； true:包含子串"),
        callback_messgae: Schema.string().description("回复的内容"),
        channelId: Schema.string().description("生效的群组ID。如果你需要应用到全局，请填入“all”"),
      })).role('table').description("关键词回复--群组  ---- 映射表"),
    }).description('关键词回复配置'),
    Schema.object({
      enable_true_middleware: Schema.boolean().default(false).description("使用前置中间件匹配模式<br>用于防止中间件阻塞等"),
      enable_loggerinfo: Schema.boolean().default(false).description("启用日志调试模式<br>日常使用无需开启"),
    }).description('调试设置'),
  ])



export function apply(ctx, config) {
  const logmessage = (message) => {
    if (config.enable_loggerinfo) {
      ctx.logger.info(message)
    }
  }

  ctx.middleware(async (session, next) => { // 屏蔽自身消息 ，防止触发关键词回复 // 或者那个转发消息的插件
    //ctx.logger.info(session.content)
    if (session.userId === session.selfId) {
      return // 屏蔽消息
    } else {
      return next()
    }
  },true) // 前置中间件 优先于普通中间件的消息处理


  ctx.middleware(async (session, next) => {
    // 获取匹配的channel
    const channels = config.table2.filter((item) => item.channelId === session.channelId || item.channelId === 'all')

    if (channels && channels.length > 0) {
      // 遍历所有配置项，进行关键词匹配
      for (const channel of channels) {
        const { keyword, enable_exp, callback_messgae } = channel

        // 根据enable_exp决定匹配方式
        const isMatched = enable_exp
          ? session.content.includes(keyword)  // 使用完全匹配（false）
          : session.content === keyword   // 使用包含匹配

        if (isMatched) {
          // 找到匹配的关键词后发送回调消息
          logmessage(`\n群组${session.channelId} - ${session.username || session.userId} 触发关键词：${keyword}\n回复内容：${callback_messgae}`)
          await session.send(callback_messgae)
        }
      }
    }

    return next()
  }, config.enable_true_middleware)
}
