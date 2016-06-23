import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Meals = new Mongo.Collection('meals');

MealSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Meal",
    },
    foods: {
        type: [String],
        label: "Foods",
    },
    owner: {
        type: String,
        label: "Owner",
        autoValue: function() {
            return this.userId;
        },
    },
    createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function() {
            return new Date()
        },
    }
});

Meals.attachSchema(MealSchema);

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('meals', function mealsPublication() {
        return Meals.find({});
    });

    Meals.allow({
        insert: function(userId, doc) {
            return !!userId;
        }
    });
}

Meteor.methods({
    'meals.insert'(text, foods) {
        check(text, String);

        // Make sure the user is logged in before inserting a food
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Foods.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
});
