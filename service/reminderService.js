var moment = require('moment');
moment().format();

var notificationService = require("./notificationService");
var eventService = require("./eventService");
var subscriberService = require("./subscriberService");

var classificationUtils = require("../util/classificationUtils");

module.exports = {
 
    remindSubscribers : function(){
        var subscribers = subscriberService.getAllSubscribers();
        for(var i=0; i<subscribers.length; i++){
            notifyPresentEvents(subscribers[i]);
            if(subscribers[i].priorReminderPeriod != undefined){
                notifyFutureEvents(subscribers[i]);
            }
        }
    }
}

function notifyPresentEvents(subscriber){
    var today = moment();
    console.log("today's date: " + today.date() + "/" + today.month());
    var profiles = subscriber.profiles;
    var todaysEvents = eventService.getEventsByDateAndProfiles(today, profiles);
    if(todaysEvents.length>0){
        notificationService.notifySubscriberOfPresentEvents(subscriber, todaysEvents);
    }
}

function notifyFutureEvents(subscriber){
    var priorReminderPeriod = subscriber.priorReminderPeriod;
    var profiles = subscriber.profiles;
            
    var futureDate = moment().add(priorReminderPeriod, "days");
    var futureEvents = eventService.getEventsByDateAndProfiles(futureDate, profiles);
    if(futureEvents.length>0){
        notificationService.notifySubscriberOfFutureEvents(subscriber, futureEvents);
    }
}
