import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Foods } from '../api/foods.js';

import './food.html';

Template.food.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  isMealForm() {
    if (Template.parentData(2).viewName === 'Template.meals') {
      return true;
    } else {
      return false;
    }
  },
  isFoodForm() {
    if (Template.parentData(2).viewName === 'Template.foodForm') {
      return true;
    } else {
      return false;
    }
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
    let foodId = instance.data._id
    if (!_.contains(eaten, foodId)) {
      eaten.push(foodId);
    } else {
      eaten = _.without(eaten, foodId);
    }
    Session.set('foodsEaten', eaten);
  },
});
