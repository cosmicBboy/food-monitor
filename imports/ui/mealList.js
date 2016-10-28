import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Meals } from '../api/meals.js';
import { Foods } from '../api/foods.js'

import './meal.html';
import './meal.js';

Template.mealList.onCreated(function bodyOnCreated() {
  console.log('meal list created');
  Meteor.subscribe("meals");
  Meteor.subscribe("foods");
  Session.set("foodsEaten", []);
  Session.set("foodsRemoved", []);
  Session.set("foodEditing", null);
});

Template.mealList.helpers({
  myMeals() {
    const myMeals = Meals.find({owner: Meteor.userId()}).fetch();
    var projection = {fields: {text: 1}};
    _.each(myMeals, doc => {
      const mealId = doc._id;
      doc.foodItems = Foods.find({_id: {$in: doc.foods}}, projection).fetch();
      _.each(doc.foodItems, function(fitem) {
        fitem.inMeal = true;
        fitem.mealId = mealId;
      });
    });
    return myMeals;
  }
});
