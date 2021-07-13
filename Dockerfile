# from 构建镜像的基础源镜像 该image镜像文件继承官方的node image
FROM node:14.0-alpine

# 在容器中创建一个工作目录
WORKDIR /usr/src/app

# RUN/COPY是分层的，package.json 提前，只要没修改就不会重新安装包
COPY package*.json ./
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install

# 捆绑应用程序源
COPY . .

EXPOSE 3333
CMD npm run start