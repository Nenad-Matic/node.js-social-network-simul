// server.js
// called on app start

// data.json will be used to read data from synchronously
// this works fine because the data is relatively small
// also no manipulation of the data is required

const filesystem = require("fs");
const dataObj = JSON.parse(filesystem.readFileSync('data/data.json', 'utf8'));

// obvious improvement is to implement a database and not keep data as JS array



// initializing the server

const app = require("express")();
const port = 8812;
app.listen(port, function() {
    console.log("Listening on " + port);
});

// handler functions

function rootHandler(request, response) {
    console.log(port + ": " + "connected to root.");
    response.sendFile('default.html', { root: __dirname});

}

function getAll (req, res) {
    console.log (port + ": requested info on all people in database.");
    res.send(dataObj);

}

function getInfo (req, res) {
    var receivedID = req.query.id;
    var person = findPersonById(receivedID);

    console.log(port + ": requested info on " + person.firstName +
        " " + person.surname + " (id = " + person.id + ")");
    res.send(person);
}

function getFriends (req, res) {
    const personID = req.query.id;
    const person = findPersonById(personID);
    const IdsOfFriends = person.friends;
    var arrayOfFriends = [];

    for (var j = 0; j<IdsOfFriends.length; j++) {
        arrayOfFriends.push(findPersonById(IdsOfFriends[j]));
    }

    const friendsJSON = JSON.stringify(arrayOfFriends);
    console.log((port + ": requested friends of " + person.firstName +
        " " + person.surname + " (id = " + person.id + ")"));

    return res.send(friendsJSON);
}

function getFriendsOfFriends (req, res) {
    var personID = req.query.id;
    var person = findPersonById(personID);
    const IdsOfFriends = person.friends;

    var IdsOfFriendsOfFriends = [];
    var arrayOfFriendsOfFriends = [];

    // first for goes trough persons direct friends
    for (var i = 0; i<IdsOfFriends.length; i++) {

        var currentFriend = findPersonById(IdsOfFriends[i]);

        // 2nd for goes trough that particular friend's friends
        for (var j = 0; j<currentFriend.friends.length; j++) {

            // if that friend was already added to the list of friends of friends
            // (perhaps from some other friend)
            // then just skip to the next step of 2nd for
            if (IdsOfFriendsOfFriends.includes(currentFriend.friends[j]))
                continue;
            else {
                // since the person is a friend of friend and it has not been added to the list
                // then we have a new person to add to our list! Hooray

                IdsOfFriendsOfFriends.push(currentFriend.friends[j]);

                //added
                arrayOfFriendsOfFriends.push(findPersonById(currentFriend.friends[j]));
            }
        }
    }


    var fofJSON = JSON.stringify(arrayOfFriendsOfFriends);

    console.log(port + ": requested friends of friends of " + person.firstName +
        " " + person.surname + " (id = " + person.id + ")");
    return res.send(fofJSON);
}

function getSuggestedFriends (req, res) {
    const personID = req.query.id;
    const person = findPersonById(personID);

    const IdsOfFriends = person.friends;

    var IdsOfFriendsOfFriends = [];
    var IdsOfSuggestedFriends = [];
    for (var i = 0; i<IdsOfFriends.length; i++) {
        var currentFriend = findPersonById(IdsOfFriends[i]);
        for (var j = 0; j<currentFriend.friends.length; j++) {
            if (IdsOfFriendsOfFriends.includes(currentFriend.friends[j])) {

            // add it to suggested friends, because it already appeared in friends of friends
            // and it isnt already suggested

                if (!IdsOfSuggestedFriends.includes(currentFriend.friends[j])) {
                    IdsOfSuggestedFriends.push(currentFriend.friends[j]);
                }

            }
            else
                IdsOfFriendsOfFriends.push (currentFriend.friends[j]);
        }
    }


    var arrayOfSuggested = [];
    for (var i = 0; i<IdsOfSuggestedFriends.length; i++) {
        arrayOfSuggested.push(findPersonById(IdsOfSuggestedFriends[i]));
    }
    console.log(IdsOfSuggestedFriends);
    console.log(arrayOfSuggested);

    var suggestJSON = JSON.stringify(arrayOfSuggested);

    console.log(port + ": requested suggest friends for " + person.firstName +
        " " + person.surname + " (id = " + person.id + ")");
    return res.send(suggestJSON);
}

// utility functions (or rather function..?)

function findPersonById(id) {
    var personWithThatID;
    for (var i = 0; i < dataObj.length; i++) {
        if (dataObj[i].id == id) {
            personWithThatID = dataObj[i]
            break;
        }
    }
    return personWithThatID;
}


// server route methods

app.get('/', rootHandler);

app.post('/getall', getAll);
app.post('/getinfo', getInfo);
app.post('/getfriends', getFriends);
app.post('/getfriendsoffriends', getFriendsOfFriends);
app.post('/getsuggested', getSuggestedFriends);














