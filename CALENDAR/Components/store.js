import { composeEventId } from "./utils";

function Store () {
    const USERS_KEY = 'USERS';
    const EVENTS_KEY = 'EVENTS';
    let arrUsers;
    let userById;

    let arrEvents;
    let eventsByComposerId;

    const users = [
        { userId: 0, userName:'All members'},
        { userId: 1, userName:'Kate'},
        { userId: 2, userName:'Mark'},
        { userId: 33, userName:'Maria'}, 
        { userId: 4, userName:'Simon'},
    ];
    if(!localStorage.getItem(USERS_KEY)){
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const events = [
        {userId: 1, time: 11, task: 'aaaaaaa', day: 2 },
        {userId: 1, time: 13, task: 'ddddddd', day: 3 },
        {userId: 33, time: 17, task: 'kkkkkkk', day: 4 },
    ];
    if(!localStorage.getItem(EVENTS_KEY)){
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }

    this.getUsers = function (){
        if(!arrUsers){
            arrUsers = [];
            userById = {};
            const lsData = localStorage.getItem(USERS_KEY);
            if (lsData) {
                const users = JSON.parse(lsData);
        
                for (var i = 0; i < users.length; i++) {
                    let user = users[i];
                    arrUsers.push(user);
                    userById[user.userId] = user;
                }
            } 
        }
        return arrUsers;
    }

    this.getEvents = function (){
        if(!arrEvents){
            arrEvents = [];
            eventsByComposerId = {};
            const lsData = localStorage.getItem(EVENTS_KEY);
            if (lsData) {
                const events = JSON.parse(lsData);
        
                for (var i = 0; i < events.length; i++) {
                    let event = events[i];
                    arrEvents.push(event);
                    eventsByComposerId[composeEventId(event)] = event;
                }

                
            } 
        }
        return arrEvents;
    }

    this.insertEvent = function( event ) {
        arrEvents.push(event);
        localStorage.setItem(EVENTS_KEY, JSON.stringify(arrEvents));
        eventsByComposerId[composeEventId(event)] = event;
    }

    this.deleteEvent = function (id) {
       let newArrEvents = [];
        for (var i = 0; i < arrEvents.length; i++) {
            let event = arrEvents[i];
            if (composeEventId(event) != id) {
                newArrEvents.push(event);
            }
        }
        arrEvents = newArrEvents;
        delete eventsByComposerId[id];

        localStorage.setItem(EVENTS_KEY, JSON.stringify(arrEvents));
    };

    this.getEvendById = function(conposetId){
        return eventsByComposerId[conposetId];
    }
}

export default new Store();