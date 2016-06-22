import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../imports/ui/home.html'
import '../imports/ui/about.html'

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('home', { main: 'foodForm' })
    }
});

FlowRouter.route('/about', {
    name: 'about',
    action() {
        BlazeLayout.render('home', { main: 'about' });
    }
});
