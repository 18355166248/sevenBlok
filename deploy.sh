#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/distBlok

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

# git init
git add -A
git commit -m 'feat: deploy'

# 如果发布到 https://<18355166248>.github.io
git push -f git@github.com:18355166248/18355166248.github.io.git master

# 如果发布到 https://<18355166248>.github.io/<REPO>
# git push -f git@github.com:18355166248/sevenBlok.git master:seven-blog

cd -
