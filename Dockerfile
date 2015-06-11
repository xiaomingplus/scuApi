# Dockerfile

# 從 [Docker Hub](https://hub.docker.com/) 安裝 Node.js image。
FROM node:0.12

# 設定 container 的預設目錄位置
WORKDIR /scuApi

# 將專案根目錄的檔案加入至 container
# 安裝 npm package
ADD . /scuApi
RUN npm install

# 開放 container 的 9231 port
EXPOSE 9231
CMD npm start
