import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Meals } from '../api/meals.js';

import './mealForm.html';

Template.mealForm.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('meals');
});

Template.mealForm.helpers({
    myMeals() {
        return Meals;
    }
})
