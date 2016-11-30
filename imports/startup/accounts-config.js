import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';

AccountsTemplates.configure({
  confirmPassword: true,
  onSubmitHook: function() {
    if (!!Meteor.userId()) {
      FlowRouter.go("/add-meal");
    }
  }
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 5,
  },
  pwd
]);

AccountsTemplates.configure({
  texts: {
    errors: {
      loginForbidden: "error.accounts.Incorrect username/password",
    }
  }
});
