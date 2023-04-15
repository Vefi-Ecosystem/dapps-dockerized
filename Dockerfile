FROM nginx:stable-alpine
COPY default.conf /etc/nginx/conf.d
COPY vefi.crt /certs/vefi.crt
COPY vefi.key /certs/vefi.key
EXPOSE 80/tcp
EXPOSE 443/tcp
ENTRYPOINT ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /usr/share/nginx/html
