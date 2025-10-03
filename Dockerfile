## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:18 as build-image

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /app/

# Install dependencies
COPY ./package*.json /app/
RUN npm config set legacy-peer-deps true
RUN npm install

# Copy the source code over
COPY . /app/

# Build the Docusaurus app
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:1.25 as politique-informatique-image
# Copy what we've installed/built from production
COPY --from=build-image /app/build /usr/share/nginx/html/
COPY ./.docker/nginx-default.conf.template   /etc/nginx/templates/default.conf.template
COPY ./.docker/docker-entrypoint.sh /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
