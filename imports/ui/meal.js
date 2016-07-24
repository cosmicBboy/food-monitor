import { Template } from 'meteor/templating';

formatDate = function(date) {
  let d = date.toDateString();
  let h = date.getHours();
  let m = date.getMinutes();
  if (h > 12) {
    period = 'PM';
  } else if (h <= 12) {
    period = 'AM';
  } else {
    throw Meteor.Error("Hour value not recognized")
  }
  return d + ", " + h + ":" + m + " " + period;
};

Template.meal.helpers({
  createDate() {
    return formatDate(this.createdAt);
  },
  mealType() {
    let m = this.mealType;
    // capitalizing the meal type
    return m.charAt(0).toUpperCase() + m.slice(1);
  }
})
