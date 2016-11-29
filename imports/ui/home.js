import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Foods } from '../api/foods.js';
import { Meals } from '../api/foods.js';

import './home.html';
import './food.html';
import './food.js';
import './mealForm.html';
import './mealForm.js';
import './mealList.html';
import './mealList.js';

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
    Meteor.logout();
    FlowRouter.go("signin");
  }
});
