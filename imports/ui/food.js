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
    'click .delete'() {
        Meteor.call('foods.remove', this._id);
    },
    'click .toggle-avoid'() {
        Meteor.call('foods.setAvoid', this._id, !this.avoid);
    },
});
