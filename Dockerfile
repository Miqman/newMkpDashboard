# build stage
# FROM node:lts as build-stage
FROM node:16.17.0 as build-stage
WORKDIR /app
COPY package*.json ./
COPY quasar.config.js ./
COPY /dist/spa ./dist/spa
COPY . .

# RUN npm install
# RUN npm -g install @quasar/cli
# RUN npm -g install @vue/cli
# RUN quasar build

# production stage

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY /nginx.conf /temp/prod.conf
RUN envsubst / < /temp/prod.conf > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]