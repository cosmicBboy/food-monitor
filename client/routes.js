import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/home.html';
import '../imports/ui/about.html';
import '../imports/ui/foodForm.html';
import '../imports/ui/mealForm.html';
import '../imports/ui/meals.html';

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('home', { main: 'foodForm' })
    }
});

FlowRouter.route('/meals', {
    name: 'meals',
    action() {
        BlazeLayout.render('home', { main: 'meals' });
    }
});

FlowRouter.route('/about', {
    name: 'about',
    action() {
        BlazeLayout.render('home', { main: 'about' });
    }
});
