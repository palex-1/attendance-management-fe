#################
# Build the app #
#################
FROM node:16.14.2-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
#RUN ng build --configuration production --output-path=/dist
RUN ng build --prod --base-href / --output-path=/dist

################
# Run in NGINX #
################
FROM nginx:alpine
COPY --from=build /dist /usr/share/nginx/html

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/configs/env.template.js > /usr/share/nginx/html/assets/configs/env.js && exec nginx -g 'daemon off;'"]