import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Foods = new Mongo.Collection('foods');

FoodSchema = new SimpleSchema({
    text: {
        type: String,
        label: "Text"
    },
    owner: {
        type: String,
        label: "Owner",
        autoValue: function() {
            return this.userId
        }
    },
    username: {
        type: String,
        label: "Username",
        autoValue: function() {
            Meteor.users.findOne(this.userId).username;
        }
    },
    avoid: {
        type: Boolean,
        label: "Avoid",
        optional: true,
    },
    createdAt: {
        type: Date,
        label: "Created At",
    }
});

Foods.attachSchema(FoodSchema);

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are public or belong to the current user
    Meteor.publish('foods', function foodsPublication() {
        return Foods.find({
            $or: [
                { private: { $ne: true} },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'foods.insert'(text) {
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
    'foods.remove'(foodId) {
        check(foodId, String);

        const food = Foods.findOne(foodId);
        if (food.private && food.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        Foods.remove(foodId);
    },
    'foods.setAvoid'(foodId, setToAvoid) {
        check(foodId, String);
        check(setToAvoid, Boolean);

        const food = Foods.findOne(foodId);

        // Make sure only the task owner can make a task private
        if (food.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Foods.update(foodId, { $set: { avoid: setToAvoid} });
    },
});
