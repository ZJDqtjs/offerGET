# OfferGET 简历助手

一个基于 Manifest V3 的本地优先浏览器扩展，用于辅助填写网申常见字段。

## 使用

1. 打开 Chrome 的 `chrome://extensions`，启用「开发者模式」。
2. 选择「加载已解压的扩展程序」，选择本目录。
3. 点击扩展图标打开侧边栏，进入「编辑我的资料」填写信息。
4. 打开网申页面，在侧边栏点击「填充当前页面」。

资料默认来自 `profile.json`，首次安装后会复制到 `chrome.storage.local`。之后的编辑、导入和导出都在浏览器本地完成，不会发送到服务器。

## 说明

扩展根据字段的 `label`、`name`、`id`、`placeholder` 和附近文本匹配常见中英文标签。不同网站的自定义字段可能需要在 `content.js` 的 `FIELD_ALIASES` 中补充别名。
