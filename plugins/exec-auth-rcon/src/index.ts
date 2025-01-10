import { exec } from 'child_process'
import { Context, h, Schema, Time } from 'koishi'
import path from 'path'

const encodings = ['utf8', 'utf16le', 'latin1', 'ucs2'] as const

export interface Config {
  root?: string
  shell?: string
  encoding?: typeof encodings[number]
  timeout?: number
  groupManagerPermission?: boolean
  permissionMap?: { userId: string, allowedCommands: string[] }[]
}

export const Config: Schema<Config> = Schema.object({
  root: Schema.string().description('工作路径。').default(''),
  shell: Schema.string().description('运行命令的程序。'),
  encoding: Schema.union(encodings).description('输出内容编码。').default('utf8'),
  timeout: Schema.number().description('最长运行时间。').default(Time.minute),
  groupManagerPermission: Schema.boolean().description('开启后，群主或管理员可以执行任何指令。').default(false),
  permissionMap: Schema.array(Schema.object({
    userId: Schema.string().description('用户ID'),
    allowedCommands: Schema.array(Schema.string()).description('允许调用的指令。全部允许请填入“all”。'),
  })).description('权限映射表。'),
})

export interface State {
  command: string
  timeout: number
  output: string
  code?: number
  signal?: NodeJS.Signals
  timeUsed?: number
}

export const name = 'spawn'

export function apply(ctx: Context, config: Config) {
  ctx.i18n.define('zh-CN', require('./locales/zh-CN'))

  // 判断是否为管理员或群主
  function isAdmin(session) {
    const sessionRoles = session.event.member.roles
    return sessionRoles && (sessionRoles.includes('admin') || sessionRoles.includes('owner'))
  }

  // 检查用户是否有权限执行指令
  function checkUserPermission(session, command: string, config: Config) {
    const userId = session.userId

    // 如果启用了群组管理权限，且用户是群主或管理员，则允许执行所有指令
    if (config.groupManagerPermission && isAdmin(session)) {
      return true
    }

    // 检查权限映射表
    const permissionEntry = config.permissionMap?.find(entry => entry.userId === userId)
    if (permissionEntry) {
      const allowedCommands = permissionEntry.allowedCommands
      if (allowedCommands.includes('all')) {
        return true // 如果有all权限，可以执行所有命令
      }
      if (allowedCommands.some(cmd => command.startsWith(cmd))) {
        return true // 如果允许的指令列表包含该指令的前缀，允许执行
      }
    }

    // 如果没有权限，返回false
    return false
  }

  ctx.command('exec <command:text>', { authority: 1 })
    .action(async ({ session }, command) => {
      if (!command) return session.text('.expect-text')

      command = h('', h.parse(command)).toString(true)

      // 判断用户是否有权限执行该命令
      if (!checkUserPermission(session, command, config)) {
        return session.text('.no-permission', { command })
      }

      const { timeout } = config
      const state: State = { command, timeout, output: '' }
      await session.send(session.text('.started', state))

      return new Promise((resolve) => {
        const start = Date.now()
        const child = exec(command, {
          timeout,
          cwd: path.resolve(ctx.baseDir, config.root),
          encoding: config.encoding,
          shell: config.shell,
          windowsHide: true,
        })
        child.stdout.on('data', (data) => {
          state.output += data.toString()
        })
        child.stderr.on('data', (data) => {
          state.output += data.toString()
        })
        child.on('close', (code, signal) => {
          state.code = code
          state.signal = signal
          state.timeUsed = Date.now() - start
          state.output = state.output.trim()
          resolve(session.text('.finished', state))
        })
      })
    })
}
/**
 * bug list
 * Windows GBK编码下 中文乱码
 * 
 */
 
/* 可以增进的地方
 * 指令的 ``authority`` 限制，这个可以通过koishi权限系统控制
 * 限制执行指令的频率 / 机器人返回消息的频率/长度 / 指令输出的关键词屏蔽/和谐 
 * 这个是exec，如果使用spawn，可以实现多用户 多上下文的并发执行，实现每个用户一个screen，同时管理screen的自动/手动退出
 * 
 */