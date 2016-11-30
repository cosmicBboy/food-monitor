import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Notifications } from "meteor/gfk:notifications";
import { Session } from 'meteor/session';

import { Foods } from '../api/foods.js';
import { Meals } from '../api/foods.js';

import './home.html';
import './food.html';
import './food.js';
import './mealForm.html';
import './mealForm.js';
import './mealList.html';
import './mealList.js';

const notificationOpts = {
  userCloseable: false,
  timeout: 5000
};

export const notify = function(type, text) {
  // Args:
  // - text: (String) text to display on UI
  //
  // This function uses the notificationActive Session variable to make sure
  // that multiple notifications cannot be displayed on the screen at the
  // same time.
  var notificationId;

  if (!Session.get("notificationActive")) {
    switch(type) {
      case "error":
        var notificationId = Notifications.error("", text, notificationOpts);
        break;
      case "success":
        var notificationId = Notifications.success("", text, notificationOpts);
        break;
      case "info":
        var notificationId = Notifications.info("", text, notificationOpts);
        break;
      default:
        throw new Meteor.Error('Unrecognized notification type');
    }
    Session.set("notificationActive", true);

    Meteor.setTimeout(function () {
      Session.set("notificationActive", false);
    }, notificationOpts.timeout);

  } else {
    // return undefined if there's already a notification on the screen
    return;
  }
}

Template.home.onCreated(function bodyOnCreated() {
  Meteor.subscribe('foods');
  Meteor.subscribe('meals');
});

Template.home.helpers({
  currentPageIsAddMeal() {
    return FlowRouter.getRouteName() === "add-meal";
  },
  currentPageIsMyMeals() {
    return FlowRouter.getRouteName() === "my-meals";
  },
  currentPageIsAbout() {
    return FlowRouter.getRouteName() === "about";
  }
});

Template.home.events({
  'click .add-meal'(event) {
    event.preventDefault();
    console.log("Go to add meals");
    FlowRouter.go('/add-meal');
  },
  'click .my-meals'(event) {
    event.preventDefault();
    console.log("Go to my meals");
    FlowRouter.go('/my-meals');
  },
  'click .about'(event) {
    event.preventDefault();
    console.log("Go to about");
    FlowRouter.go('/about');
  },
  'click .logout'(event) {
    event.preventDefault();
    Meteor.logout(function(error, result) {
      if (error) {
        throw new Meteor.Error(error);
      }
      FlowRouter.go("signin");
    });
  }
});
