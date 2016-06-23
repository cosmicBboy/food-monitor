import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Foods } from '../api/foods.js';
import { Meals } from '../api/foods.js';

import './home.html';
import './foodForm.html';
import './foodForm.js';
import './food.html';
import './food.js';
import './mealForm.html';
import './mealForm.js';

Template.home.onCreated(function bodyOnCreated() {
    Meteor.subscribe('foods');
    Meteor.subscribe('meals');
});

Template.home.helpers({
});

Template.home.events({
    'submit .new-food'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form elemnt
        const target = event.target;
        const text = target.text.value;

        // Insert a task into the collection
        Meteor.call('foods.insert', text);

        // Clear form
        target.text.value = '';
    },
});
