#!/bin/bash

# initialize default values for parameters
ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL=${ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL:='https://politique-informatique.abes.fr'}
# remove optional trailing slash (do not want it)
ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL="$(printf '%s' "$ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL" | sed 's:/*$::')"
export ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL

# patch sitemap because it needs to have the absolute url
if [ ! -f /usr/share/nginx/html/sitemap.xml.orig ]; then
  cp -f /usr/share/nginx/html/sitemap.xml /usr/share/nginx/html/sitemap.xml.orig
fi
sed "s#https://politique_informatique_abes_baseurl_placeholder#${ABES_POLITIQUE_INFORMATIQUE_HTTP_BASEURL}#g" \
  /usr/share/nginx/html/sitemap.xml.orig \
  > /usr/share/nginx/html/sitemap.xml

# Pass control to the main process
exec "$@"
