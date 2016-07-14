import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Meals } from '../api/meals.js';
import { Foods } from '../api/foods.js';

import './mealList.html';

Template.mealList.onCreated(function bodyOnCreated() {
  console.log('meal list created');
});

Template.mealList.helpers({
  myMeals() {
    const myMeals = Meals.find({owner: Meteor.userId()}).fetch();
    var projection = {fields: {text: 1}};
    _.each(myMeals, function(doc) {
      let foods = Foods.find({_id: {$in: doc.foods}}, projection).fetch();
      doc.foodItems = _.pluck(foods, 'text');
    });
    return myMeals;
  },
  myFoods() {
    return Foods.find({});
  }
});
