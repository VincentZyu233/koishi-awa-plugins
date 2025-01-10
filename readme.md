# awa-bot 的插件库

---

暂时还没想好写什么呢~

只有一点点小玩具

---


## 如何在项目模板中开发此仓库（开发者指南） 🛠️

### 引入此仓库

1. **创建项目模板**  🚀
   ```shell
   yarn create koishi
   ```
   然后一路回车，直到弹出koishi的webUI。

2. **进入项目模板根目录**  📂

   先在koishi终端 按下 `Ctrl + C` 退出项目模板，然后 `cd` 进入目录：
   ```shell
   cd koishi-app
   ```

3. **克隆本仓库** ⬇️
   ```shell
   yarn clone VincentZyu233/koishi-awa-plugins
   ```

4. **修改 Koishi 根工作区的 `tsconfig.json`** 📝

   在 `tsconfig.json` 中添加以下内容：
   ```json
      "koishi-plugin-*": [
        "external/koishi-awa-plugins/plugins/*/src", // 添加这一行
        "external/*/src",
        "external/*/packages/core/src",
        "packages/*/src",
        "plugins/*/src",        
      ],
   ```
 
5. **以开发模式启动**  🚧
   ```shell
   yarn dev
   ```
