import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Foods } from '../api/foods.js';

import './food.js';
import './home.html';

Template.home.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('foods');
});

Template.home.helpers({
    suspectCount() {
        return Foods.find({ checked: { $ne: false} }).count();
    },
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
    'change .highlight-suspects input'(event, instance) {
        instance.state.set('showSuspects', event.target.checked);
    },
});

Template.foodForm.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('foods');
});

Template.foodForm.helpers({
    foods() {
        let sortOpt = { sort: { createdAt: -1 } };
        let query = {};
        const instance = Template.instance();
        if (instance.state.get('showSuspects')) {
            // If show suspects is checked, filter tasks
            query = { checked: { $ne: false } };
        }
        // Otherwise, return all of the tasks
        return Foods.find(query, sortOpt);
    },
    noSuspects() {
        const instance = Template.instance();
        let zeroCount = Foods.find({ checked: { $ne: false} }).count() === 0;
        let showSuspects = instance.state.get('showSuspects');
        return zeroCount && showSuspects;
    },
});
