/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Foods } from './foods.js';

if (Meteor.isServer) {
    describe('Foods', () => {
        describe('methods', () => {
            const userId = Random.id();
            let foodId;

            beforeEach(() => {
                Foods.remove({});
                foodId = Foods.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'cosmicbboy',
                });
            });

            it('can delete owned food', () => {
                // Find the internal implementation of the food method so we
                // can test it in isolation
                const deleteFood = Meteor.server.method_handlers['foods.remove'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                deleteFood.apply(invocation, [foodId]);

                // Verify that the method does what we expected
                assert.equal(Foods.find().count(), 0);
            });
        });
    });
}
