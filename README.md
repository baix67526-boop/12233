# 考研调剂助手

腾讯云部署配置：
- 分支：main
- 代码根目录：/
- 构建命令：npm run build
- 产物目录：dist
- 部署路径：/kaoyan-helper2/

## 自动部署

GitHub Actions 工作流：.github/workflows/deploy-cloudbase.yml。
每次推送 main 后构建并部署到腾讯云，需要仓库 Actions secrets：TCB_SECRET_ID、TCB_SECRET_KEY。不要在源码中保存密钥。

2026-11-26：配置凭据后触发首次端到端验证；部署结果待确认。
