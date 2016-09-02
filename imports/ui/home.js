import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Foods } from '../api/foods.js';
import { Meals } from '../api/foods.js';

import './home.html';
import './food.html';
import './food.js';
import './mealForm.html';
import './mealForm.js';
import './mealList.html';
import './mealList.js';

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

        // Insert a food into the collection
        Meteor.call('foods.insert', text);

        // Clear form
        target.text.value = '';
    },
    'click .add-meal'(event) {
        event.preventDefault();
        console.log("Go to add meals");
        FlowRouter.go('/');
    },
    'click .my-meals'(event) {
        event.preventDefault();
        console.log("Go to my meals");
        FlowRouter.go('/my-meals');
    },
    'click .about-btn'(event) {
        event.preventDefault();
        console.log("Go to about");
        FlowRouter.go('/about');
    }
});
