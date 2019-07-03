# Express Chat

Node.js chat application using Express, Socket.io, Redis and Mithril.

---

## Environment variables

| Variable | Description | Type | Default value |
| -------- | ----------- | ---- | ------------- |
| **ENV** | Environment | *optional* | development
| **PORT** | Port app | *optional* | 5000
| **FLARUM_API_ENDPOINT** | API URL | **required** | none
| **COOKIES_SECRET** | Set random cookies secret | **required** | none
| **SESSION_SECRET** | Set random session secret | **required** | none
| **REDIS_URL** | Redis instance ip/hostname | **required**  | none
| **PIWIK_ID** | Piwik id | *optional* | none
| **PIWIK_URL** | Piwik url | *optional* | none

---

## Manual installation (Production)

### Requirements:

* Node.js
* Yarn
* Redis

Clone the project and install dependencies :
```bash
git clone https://github.com/devmonster423/express-chat
cd express-chat

yarn global add bower gulp pm2
yarn install

gulp
```

Create .env file in project root with this content :

```
ENV=production
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
FLARUM_API_ENDPOINT=http://domain.tld/api/
```

Start application :

```bash
pm2 start --node-args="--harmony" --name express-chat app.js
```

Open app : http://127.0.0.1:5000/

---

## Manual installation (Developement)

### Requirements:

* Node.js
* Yarn
* Redis

Clone the project and install dependencies :
```bash
git clone https://github.com/devmonster423/express-chat
cd express-chat

yarn global add -g bower gulp nodemon
yarn install

gulp
```

Create .env file in project root with this content :

```
ENV=development
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
FLARUM_API_ENDPOINT=http://domain.tld/api/
```

Create Procfile_dev file in project root with this content :

```
web: nodemon --delay 1 --exec "node --harmony" app.js
worker: gulp watch
```

Start application :

```bash
foreman start -f Procfile_dev
```

Open app : http://127.0.0.1:5000/

---

## Docker installation

### Pull image
```bash
docker pull express/express-chat
```

### Image usage

#### Environment variables

Set environment variables in [docker-compose.yml](https://github.com/devmonster423/express-chat/blob/master/docker-compose.yml)

* ENV=production
* FLARUM_API_ENDPOINT=http://your-domain.tld/api/
* COOKIES_SECRET=PLEASE_REPLACE_BY_RANDOM_VALUE
* SESSION_SECRET=PLEASE_REPLACE_BY_RANDOM_VALUE
* REDIS_URL=redis://redis:6379

#### Requirements:

* Docker

#### Setup

We have created a [docker-compose.yml](https://github.com/devmonster423/express-chat/blob/master/docker-compose.yml) including 3 containers :

* chat
* redis
* nginx : reverse-proxy mode

Create a new nginx vhost with this content :

```nginx
# /mnt/docker/nginx/sites-enabled/chat.conf

server {

  listen 8000;
  server_name chat.domain.tld;

  location / {
    proxy_pass http://chat:5000;
    # For websockets handshake to establish the upgraded connection
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

}
```

Run !

```bash
docker-compose up -d
```

---

## Development Docker installation

#### Requirements:

* Docker
* Node.js
* Gulp
* npm

#### Set environment variables
```bash
sudo echo '127.0.0.1 express-chat.dev' >> /etc/hosts
echo 'export FLARUM_API_ENDPOINT="http://your-domain.tld/api/"' >> ~/.bash_profile
```

#### Setup

```bash
cd /path/to/chat/express-chat
npm install
docker-compose --file dev.yml up -d
gulp watch
```
Open app : http://express-chat.dev:5000/

---

## Roadmap

- Private rooms
- Unit tests + coverage
- Build an API
- Increase chatbot IQ

## Contribute

- Fork this repository
- Create a new feature branch for a new functionality or bugfix
- Commit your changes
- Push your code and open a new pull request
- Use [issues](https://github.com/devmonster423/express-chat/issues) for any questions

## Support

https://github.com/devmonster423/express-chat/issues

## License

Apache License Version 2.0
