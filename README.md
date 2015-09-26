# URL Heroku : #

https://mondedie-chat.herokuapp.com/

# Installation avec Vagrant #

## Prérequis:

- [chef-dk](https://downloads.chef.io/chef-dk/)
- [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- [vagrant](https://www.vagrantup.com/downloads.html)

### Vagrant plugins :

```
vagrant plugin install vagrant-berkshelf
vagrant plugin install vagrant-hostmanager
```

## Up !

```
vagrant up
```

Ouvrir l'app `http://mondedie-chat.dev`

# Installation de la version de développement en local : #

Installer :

* heroku toolbelt : https://toolbelt.heroku.com/
* Node.js
* NPM
* Redis

Cloner le projet et installer les dépendances :
```
heroku git:clone -a mondedie-chat
cd mondedie-chat

npm install -g bower
npm install -g gulp
npm install -g nodemon
npm install

gulp
```

Créer un .env à la racine du projet avec ce contenu :

```
ENV=development
APP_URL=http://127.0.0.1:5000/
COOKIES_SECRET=Xpg29n6s9hGuKqWA24U3w5gBAD46yw5X
SESSION_SECRET=4fQ9FMEGqYSw3d289h72zx7S4hytb6BG
FLARUM_API_ENDPOINT=http://flarum.mondedie.fr/api/
```

Créer un fichier Procfile_dev à la racine du projet avec ceci :

```
web: nodemon app.js
worker: gulp watch
```

Lancer l’application avec :

```
foreman start -f Procfile_dev
```
