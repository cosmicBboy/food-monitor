import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Foods } from '../api/foods.js';

import './foodForm.html'

Template.foodForm.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('foods');
});

Template.foodForm.helpers({
    foods() {
        let sortOpt = { sort: { createdAt: -1 } };
        let query = {};
        const instance = Template.instance();
        if (instance.state.get('showAvoiding')) {
            // If show suspects is checked, filter tasks
            query = { avoid: { $ne: false } };
        }
        // Otherwise, return all of the tasks
        return Foods.find(query, sortOpt);
    },
});

Template.foodForm.events({
    'change .highlight-avoiding input'(event, instance) {
        instance.state.set('showAvoiding', event.target.checked);
    },
});
