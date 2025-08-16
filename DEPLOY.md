# Gitee Pages 部署指南

本指南将详细介绍如何将数字账号交易平台部署到Gitee Pages。

## 前置准备

1. **注册Gitee账号**
   - 访问 [https://gitee.com](https://gitee.com)
   - 点击右上角"注册"按钮
   - 填写用户名、邮箱、密码完成注册
   - 验证邮箱激活账号

2. **安装Git（如果尚未安装）**
   - 下载地址：[https://git-scm.com/download](https://git-scm.com/download)
   - 安装完成后配置用户信息：
   ```bash
   git config --global user.name "你的用户名"
   git config --global user.email "你的邮箱"
   ```

## 部署步骤

### 方法一：通过Gitee网页界面上传

1. **创建仓库**
   - 登录Gitee，点击右上角"+"号
   - 选择"新建仓库"
   - 填写仓库名称（建议使用英文，如：digital-trading-platform）
   - 选择"公开"（Gitee Pages需要公开仓库）
   - 勾选"使用Readme文件初始化这个仓库"
   - 点击"创建"

2. **上传项目文件**
   - 进入创建的仓库
   - 点击"上传文件"
   - 将项目中的所有文件拖拽到上传区域
   - 填写提交信息："初始化项目文件"
   - 点击"提交"

3. **启用Gitee Pages**
   - 在仓库页面点击"服务"选项卡
   - 找到"Gitee Pages"并点击
   - 选择部署分支：master
   - 选择部署目录：/ (根目录)
   - 点击"启动"
   - 等待部署完成（通常需要1-3分钟）

### 方法二：通过Git命令行

1. **创建仓库**（同方法一的步骤1）

2. **初始化本地Git仓库**
   ```bash
   # 在项目目录下执行
   cd c:\Users\777\ai
   git init
   git add .
   git commit -m "初始化项目"
   ```

3. **关联远程仓库**
   ```bash
   # 替换为你的实际仓库地址
   git remote add origin https://gitee.com/你的用户名/你的仓库名.git
   ```

4. **推送代码**
   ```bash
   git push -u origin master
   ```

5. **启用Gitee Pages**（同方法一的步骤3）

## 访问网站

部署成功后，你的网站将可以通过以下地址访问：
```
https://你的用户名.gitee.io/你的仓库名
```

例如：`https://zhangsan.gitee.io/digital-trading-platform`

## 更新网站

当你需要更新网站内容时：

### 通过网页界面
1. 在Gitee仓库中直接编辑文件
2. 或者上传新的文件覆盖旧文件
3. 提交更改
4. 在Gitee Pages设置中点击"更新"按钮

### 通过Git命令
```bash
# 修改文件后
git add .
git commit -m "更新网站内容"
git push origin master

# 然后在Gitee Pages设置中点击"更新"按钮
```

## 自定义域名（可选）

如果你有自己的域名，可以绑定到Gitee Pages：

1. 在域名管理后台添加CNAME记录：
   - 记录类型：CNAME
   - 主机记录：www（或其他子域名）
   - 记录值：你的用户名.gitee.io

2. 在Gitee Pages设置中：
   - 填写自定义域名
   - 点击"保存"
   - 等待DNS生效（通常需要10分钟到24小时）

## 注意事项

1. **仓库必须是公开的**：Gitee Pages免费版只支持公开仓库

2. **文件大小限制**：单个文件不能超过100MB，仓库总大小建议不超过1GB

3. **更新延迟**：修改代码后需要在Gitee Pages设置中手动点击"更新"按钮

4. **HTTPS支持**：Gitee Pages自动提供HTTPS支持

5. **访问速度**：Gitee Pages在国内访问速度较快

## 常见问题

**Q: 部署后页面显示404？**
A: 检查是否有index.html文件在根目录，确保文件名正确。

**Q: 修改代码后网站没有更新？**
A: 需要在Gitee Pages设置中手动点击"更新"按钮。

**Q: 图片或CSS文件加载失败？**
A: 检查文件路径是否正确，建议使用相对路径。

**Q: 管理员功能无法使用？**
A: 静态网站无法保存数据，管理员功能仅用于演示。如需完整功能，需要后端支持。

## 技术支持

如果在部署过程中遇到问题，可以：
1. 查看Gitee官方文档：[https://gitee.com/help](https://gitee.com/help)
2. 联系Gitee客服
3. 在项目仓库中提交Issue

---

祝你部署成功！🎉