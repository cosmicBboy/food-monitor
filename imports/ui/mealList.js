import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Meals } from '../api/meals.js';
import { Foods } from '../api/foods.js';

import './meal.html';
import './meal.js';

Template.mealList.onCreated(function bodyOnCreated() {
  console.log('meal list created');
  Meteor.subscribe("meals");
  Session.set("foodsEaten", []);
  Session.set("foodEditing", null);
});

Template.mealList.helpers({
  myMeals() {
    const myMeals = Meals.find({owner: Meteor.userId()}).fetch();
    var projection = {fields: {text: 1}};
    _.each(myMeals, function(doc) {
      doc.foodItems = Foods.find({_id: {$in: doc.foods}}, projection).fetch();
    });
    return myMeals;
  },
});
