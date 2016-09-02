import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/home.html';
import '../../ui/about.html';
import '../../ui/mealForm.html';
import '../../ui/meals.html';
import '../../ui/mealList.html';

FlowRouter.route('/', {
    name: 'meals',
    action() {
        BlazeLayout.render('home', { main: 'meals' })
    }
});

FlowRouter.route('/my-meals', {
    name: 'my-meals',
    action() {
        BlazeLayout.render('home', { main: 'mealList' });
    }
});

FlowRouter.route('/about', {
    name: 'about',
    action() {
        BlazeLayout.render('home', { main: 'about' });
    }
});
