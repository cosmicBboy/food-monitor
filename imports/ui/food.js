import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Foods } from '../api/foods.js';

import './food.html';

// function for adjusting the size of the edit-food input
function resizeInput() {
  let inputLength = $(this).val().length;
  if (inputLength == 0) {
    inputLength = 1
  }
  // padding of 1
  $(this).attr('size', inputLength + 1);
};

Template.food.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  isEaten() {
    // This function should return true if the food template
    // id is in the foodsEaten reactive dictionary
    if (_.contains(Session.get('foodsEaten'), this._id)) {
      return true;
    } else {
      return false;
    }
  },
  isEditing() {
    if (Session.equals('foodEditing', this._id)) {
      return true;
    } else {
      return false;
    }
  },
  isNotEditable() {
    return !Template.currentData().inBasket && FlowRouter.getRouteName() === "my-meals";
  },
  inBasket() {
    return Template.currentData().inBasket;
  },
  foodGestures: {
    'press .food-item' (event, instance) {
      Session.set('foodEditing', instance.data._id)
    },
  }
});

Template.food.events({
  'click .delete'() {
    Meteor.call('foods.remove', this._id);
  },
  'click .toggle-avoid'() {
    Meteor.call('foods.setAvoid', this._id, !this.avoid);
  },
  'click .toggle-eaten'(event, instance) {
    // Pushes food ids into foodsEaten Session variable
    event.preventDefault();
    let eaten = Session.get('foodsEaten');
    const foodId = instance.data._id;

    // Don't push any foodId into foodsEaten if currently editing
    if (Session.equals('foodEditing', foodId)) {
      console.log("Currently editing food item. Do anything with foodEaten");
      return null;
    }
    if (!_.contains(eaten, foodId)) {
      eaten.push(foodId);
    } else {
      eaten = _.without(eaten, foodId);
    }
    console.log("Eaten", eaten);
    Session.set('foodsEaten', eaten);
  },
  'submit .edit-food'(event, instance) {
    event.preventDefault();
    const originalText = instance.data.text;
    const text = event.target.text.value;

    if (originalText == text) {
      console.log("Edited text is the same! Not making server call");
    } else {
      console.log("Client: text", text);
      Meteor.call('foods.edit', instance.data._id, text)
    }
    Session.set('foodEditing', null)
  },
  'focus .edit-food-input'(event, instance) {
    instance.$(".edit-food-input")
      .keyup(resizeInput)
      .each(resizeInput);
  }
});

Template.foodEdit.onRendered(function() {
  this.$('.edit-food-input').focus();
});
