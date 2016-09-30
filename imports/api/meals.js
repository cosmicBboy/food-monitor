import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Meals = new Mongo.Collection('meals');

MealSchema = new SimpleSchema({
    mealType: {
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
    username: {
        type: String,
        label: "Username",
        autoValue: function() {
            Meteor.users.findOne(this.userId).username;
        }
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
    'meals.insert'(mealType, foods) {
        check(mealType, String);
        check(foods, Array);

        // Make sure the user is logged in before inserting a food
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        if (foods.length === 0) {
            throw new Meteor.Error('You must check off at least one food!');
        }

        const meal = {
            mealType: mealType,
            foods: foods,
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
            createdAt: new Date(),
        };

        console.log("Inserting meal:", meal);
        Meals.insert(meal);
    },
    'meals.update'(mealId, foodBasket) {
        check(mealId, String);
        check(foodBasket, Array);

        console.log(mealId);
        console.log(foodBasket);

        // Make sure the user is logged in before inserting a food
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        if (foodBasket.length === 0) {
            throw new Meteor.Error('The foodBasket can\'t be empty!');
        }

        console.log("Updating meal:", foodBasket);
        Meals.update(mealId, {
            $push: { foods: { $each: foodBasket } },
        });
        console.log(Meals.find({_id: mealId}).fetch());

    },
});
