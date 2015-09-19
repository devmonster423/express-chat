var express = require('express');
var async   = require('async');

var session = require('../libs/session');
var flarum  = require('../libs/flarum');

var users    = require('../models/users');
var messages = require('../models/messages');

var router = express.Router();

router.get('/', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function( settings ) {
    settings.title += "Connexion";
    res.render('login', settings);
  });
});

router.post('/login', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:false }, function( settings ) {

    req.checkBody('username', "Valeur invalide").notEmpty();
    req.checkBody('password', "Valeur invalide").notEmpty();

    var errors = req.validationErrors( true );

    async.waterfall([
      // Vérification du formulaire
      function( callback ) {
        if( errors )
          callback("Veuillez saisir vos identifiants mondedie.fr - flarum");
        else
          callback();
      },
      // Authentification via l'API
      function( callback ) {
        flarum.login(req.body, next, function( user ) {
          if( user )
            callback( null, user );
          else
            callback("Identifiant ou mot de passe incorrect.");
        });
      },
      // Préparation de la session
      function( user, callback ) {
        flarum.user(user, next, function( userInfos ) {
          if( userInfos ) {
            req.session.user = {
              id:userInfos.data.id,
              name:userInfos.data.attributes.username,
              groupName:( userInfos.included ) ? userInfos.included[0].attributes.namePlural : null,
              groupColor:( userInfos.included ) ? userInfos.included[0].attributes.color : null,
              avatar:( userInfos.data.attributes.avatarUrl ) ? userInfos.data.attributes.avatarUrl : process.env.APP_URL + 'images/avatar.png'
            };
            callback();
          } else {
            callback("Impossible d'initialiser la session utilisateur.");
          }
        });
      },
      // On vérifie que l'utilisateur ne soit pas déjà connecté
      function( callback ) {
        users.exist(req.session.user.name, function( exist ) {
          if( exist )
            callback("Vous êtes déjà connecté au chat.");
          else
            callback();
        });
      }
    ], function( err ) {
      if( err ) {
        req.session.destroy(function() {
          settings.formMessage = err;
          return res.render('login', settings);
        });
      } else {
        return res.redirect('/chatroom');
      }
    });
  });
});

router.get('/chatroom', function(req, res, next) {
  session.settings(req, res, { shouldBeLogged:true }, function( settings ) {
    settings.title += "Chatroom";
    settings.user = req.session.user;
    res.render('chatroom', settings);
  });
});

router.get('/get/messages', function( req, res, next ) {
  session.settings(req, res, { shouldBeLogged:true }, function( settings ) {
    messages.list(function( list ) {
      res.json({ messages:list });
    });
  });
});

router.get('/logout', function( req, res, next ) {
  session.settings(req, res, { shouldBeLogged:true }, function( settings ) {
    req.session.destroy(function() {
      return res.redirect('/');
    });
  });
});

module.exports = router;