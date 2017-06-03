const express = require('express');
const ensure = require('connect-ensure-login');
const bcrypt = require('bcrypt');

const User = require('../models/userModel.js');


const routeforUser = express.Router();


// routeforUser.get('/user/:id', (req, res, next) => {

routeforUser.get('/profile/edit',
    ensure.ensureLoggedIn('/login'),

    (req, res, next) => {
        res.render('user/editUserProfile.ejs', {
        successMessage: req.flash('success')
        });
    }
);

// <form method="post" action="/profile/edit">
routeforUser.post('/profile/edit',

  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

    if (profileName === '' || profileUsername === '' || currentPassword==='' || newPassword ==='') {
      res.render('user/editUserProfile.ejs', {
        errorMessage: 'Please all info is required.'
      });
      return;
    }
    if (newPassword.length<=6 || newPassword.length >=12) {
      res.render('user/editUserProfile.ejs', {
        errorMessage: 'Password need to have between 6 and 12 characters.'
      });
      return;
    }

    User.findOne(
      { username: profileUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // if there's a user with the username and it's not you
        if (foundUser && !foundUser._id.equals(req.user._id)) {
          res.render('user/edit-profile-view.ejs', {
            errorMessage: 'Username already taken.'
          });
          return;
        }

        // const profileChanges = {
        //   name: req.body.profileName,
        //   username: req.body.profileUsername
        // };

        // add updates from form
        req.user.name = req.body.profileName;
        req.user.username = req.body.profileUsername;

        // if both passwords are filled and the current password is correct
        if (currentPassword && newPassword
            && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          // add new encryptedPassword to the updates
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt);
          // profileChanges.encryptedPassword = hashPass;
          req.user.encryptedPassword = hashPass;
        }

        // save updates!
        req.user.save((err) => {
          if (err) {
            next(err);
            return;
          }

          req.flash('success', 'Changes saved.');

          res.redirect('/profile/edit');
        });


      }
    );
  }
);


// Query to make people admins in MongoDB shell
// db.users.updateOne(
//   { username: 'nizar' },
//   { $set: { role: 'admin' } }
// )
routeforUser.get('/myaccount',
  ensure.ensureLoggedIn(),

  (req, res, next) => {
    User.find(
      { owner: req.user._id },

      (err, myAccountPhotoList) => {
        if (err) {
          next(err);
          return;
        }

        res.render('user/myaccount.ejs', {
          myAccountPhotoList: myAccountPhotoList,
          successMessage: req.flash('success')
        });
      }
    );
  }
);












routeforUser.get('/users', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.find((err, usersList) => {
      if (err) {
        next(err);
        return;
      }

      res.render('user/users-list-view.ejs', {
        users: usersList,
        successMessage: req.flash('success')
      });
    });
  }

  // Otherwise show 404 page
  else {
    next();
  }
});


routeforUser.post('/users/:id/admin', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        req.flash('success', `User "${theUser.name}" is now an admin. 😎`);

        res.redirect('/users');
      }
    );
    return;
  }

  // Otherwise show 404 page
  else {
    next();
  }
});


module.exports = routeforUser;