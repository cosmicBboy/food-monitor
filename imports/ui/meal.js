import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { Foods } from '../api/foods.js';

import './meal.html';

formatDate = function(date) {
  let d = date.toDateString();
  let h = date.getHours();
  let m = date.getMinutes();
  if (h > 12) {
    period = 'PM';
  } else if (h <= 12) {
    period = 'AM';
  } else {
    throw Meteor.Error("Hour value not recognized")
  }
  return d + ", " + h + ":" + m + " " + period;
};

createFoodStore = function(basket, mealFood) {
  // Args:
  //  basket:   takes a basket (FoodStore query result)
  //  mealFood: a list of food object ids
  const store = _.filter(basket, function(o) {
    return !_.contains(mealFood, o._id);
  });
  _.each(store, function(o) { return o.inBasket = true; });
  return store;
}

Template.meal.helpers({
  createDate() {
    return formatDate(this.createdAt);
  },
  mealType() {
    let m = this.mealType;
    // capitalizing the meal type
    return m.charAt(0).toUpperCase() + m.slice(1);
  },
  isEditable() {
    return FlowRouter.getRouteName() === "my-meals";
  },
  isEditing() {
    return Template.currentData()._id === Session.get("editingMeal");
  },
  addingFood() {
    return Template.currentData()._id === Session.get("addingFood");
  },
  myFoods() {
    return createFoodStore(
      Foods.find({}).fetch(), Template.currentData().foods);
  },
})

Template.meal.events({
  'click .dropdown-menu'(event) {
    event.stopPropagation();
  },
  'click .edit-button'(event, instance) {
    Session.set("editingMeal", instance.data._id);
    Session.set("addingFood", instance.data._id);
  },
  'click .save-button'(event, instance) {
    event.preventDefault();
    const basket = Session.get("foodsEaten");
    const foodsRemoved = Session.get("foodsRemoved");
    const mealId = Session.get("editingMeal");

    if (basket.length === 0) {
      console.log("No foods have been added");
    } else {
      Meteor.call("meals.add", mealId, basket);
      // reset the form
      Session.set("foodsEaten", []);
      instance.$(".meal-type-input").each(function(index) {
        $(this).removeClass("active");
      });
    }

    if (foodsRemoved.length === 0) {
      console.log("No foods have been removed");
    } else {
      console.log("To Remove", foodsRemoved);
      Meteor.call("meals.remove", mealId, foodsRemoved);
      // reset the form
      Session.set("foodsRemoved", []);
      instance.$(".meal-type-input").each(function(index) {
        $(this).removeClass("active");
      });
    }

    Session.set("editingMeal", null);
    Session.set("addingFood", null);

  },
});
