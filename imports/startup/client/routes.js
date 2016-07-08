import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/home.html';
import '../../ui/about.html';
import '../../ui/foodForm.html';
import '../../ui/mealForm.html';
import '../../ui/meals.html';

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
