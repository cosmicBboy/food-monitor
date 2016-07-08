import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Foods } from '../api/foods.js';

import './food.html';

Template.food.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('foodsEaten', []);
});

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
});

Template.food.events({
    'click .delete'() {
        Meteor.call('foods.remove', this._id);
    },
    'click .toggle-avoid'() {
        Meteor.call('foods.setAvoid', this._id, !this.avoid);
    },
    'click .toggle-eaten'(event, instance) {
        event.preventDefault();
        console.log(instance.state.get('foodsEaten'));
        console.log('Should toggle food as eaten');
    },
});
