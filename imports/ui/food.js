import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Foods } from '../api/foods.js';

import './food.html';

Template.food.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
});

Template.food.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('foods.setChecked', this._id, !this.checked);;
    },
    'click .delete'() {
        Meteor.call('foods.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('foods.setPrivate', this._id, !this.private);
    },
});
