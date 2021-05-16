#!/bin/bash

if [[ $(git describe --tags) =~ ^v(.*) ]]; then
  imageName=docker.chao.tokyo/das-dictionary:"${BASH_REMATCH[1]}"
fi

docker build -t "$imageName" .
docker push "$imageName"
echo "run this on production environment"
echo sudo docker run -e "VIRTUAL_HOST=fukamushi.chao.tokyo" -e "LETSENCRYPT_HOST=fukamushi.chao.tokyo" --net common_link -d "$imageName"