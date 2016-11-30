import { Meteor } from "meteor/meteor";
import { Session } from 'meteor/session';
import { Template } from "meteor/templating";
import { _ } from "meteor/underscore";

import { Foods } from "../api/foods.js";
import { Meals } from "../api/meals.js";
import { notify } from "./home.js";

import "./mealForm.html";

function resizeInput() {
  let inputLength = $(this).val().length;
  if (inputLength == 0) {
    inputLength = 2
  }
  // padding of 1
  $(this).attr('size', inputLength + 1);
};

Template.mealForm.onCreated(function bodyOnCreated() {
  Session.set("foodsEaten", []);
  Session.set("foodEditing", null);
  Session.set("addingNewFood", false);
  Session.set("mealType", null);
  Meteor.subscribe("meals");
  Meteor.subscribe("foods");
});

Template.mealForm.helpers({
  myFoodChunks() {
    let foods = Foods.find({}, {sort: {text: 1}}).fetch();
    let n = 4;
    let foodChunks = _.chain(foods).groupBy(function(element, index){
      return Math.floor(index/n);
    }).toArray().value();
    console.log("Food chunks", foodChunks);
    return foodChunks;
  },
  addingNewFood() {
    return !!Session.get("addingNewFood");
  }
});

Template.mealForm.events({
  "click .submit-new-meal" (event, instance) {
    event.preventDefault();
    const foods = Session.get("foodsEaten");
    const mealType = Session.get("mealType");
    var msg;
    // only call meals.insert if foods Array contains objects
    if (!mealType) {
      msg = "What kind of meal did you have... " +
            "breakfast, lunch, dinner, or a snack?";
      notify("error", msg);
    } else if (foods.length === 0) {
      notify("error", "Please select at least one food!");
    } else {
      Meteor.call("meals.insert", mealType, foods);
      notify("success", "Congrats! You added a new meal");
      // reset the form
      Session.set("foodsEaten", []);
      instance.$(".meal-type-input").each(function(index) {
        $(this).removeClass("active");
      });
    }
  },
  "click .meal-type-input" (event, instance) {
    event.preventDefault();
    const mealType = event.target.id;
    const sessionMealType = Session.get("mealType");
    // add active class to only the meal input type
    // that matches the currect click event id value
    instance.$(".meal-type-input").each(function(index) {
      let $mealType = $(this),
          elemType = $mealType.attr("id");
      if (elemType === mealType && elemType !== sessionMealType) {
        $mealType.addClass("active");
        Session.set("mealType", mealType);
      } else if (elemType === mealType && elemType === sessionMealType) {
        $mealType.removeClass("active");
        Session.set("mealType", null);
      } else {
        $mealType.removeClass("active");
      }
    });
  },
  "click #open-add-form" (event, instance) {
    Session.set("addingNewFood", true);
  },
  "click #add-food-stop" (event, instance) {
    Session.set("addingNewFood", false);
  },
  "click .submit-food" (event, instance) {
    $(".add-food-input").focus();
    $(".add-food-form").submit();
  },
  "submit .add-food-form" (event, instance) {
    event.preventDefault();
    const target = event.target;
    const text = target.text.value;
    if (text.length === 0) {
      // TODO: Add notification here
      console.log("You have to type something!");
    } else {
      Meteor.call("foods.insert", text);
      target.text.value = "";
    }
  },
  "focus .add-food-input" (event, instance) {
    instance.$(".add-food-input")
      .keyup(resizeInput)
      .each(resizeInput);
  },
  "blur .add-food-input" (event, instance) {
    var relTarget = event.relatedTarget;
    if (!relTarget) {
      Session.set("addingNewFood", false);
    }
  },
});

Template.mealFormAddFood.onRendered(function() {
  const instance = Template.instance();

  this.autorun(function() {
    if (Session.get("addingNewFood")) {
      Meteor.setTimeout(function() {
        instance.$(".add-food-input").focus();
      }, 500);
    }
  });
});

Template.mealFormAddFood.helpers({
  addingNewFood() {
    return !!Session.get("addingNewFood");
  }
});

Template.mealFormAddFood.events({
  "click .submit-food" (event, instance) {
    $(".add-food-form").submit();
  },
});
