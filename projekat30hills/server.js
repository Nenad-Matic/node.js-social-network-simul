// server.js
// called on app start

const bodyParser = require("body-parser");

// since this is a demo app, implementing a real database would be an overkill
// data.json will be used to read data from synchronously
// this works fine because the data is relatively small
// also no manipulation of the data is required

const filesystem = require("fs");
const dataObj = JSON.parse(filesystem.readFileSync('data/data.json', 'utf8'));


const app = require("express")();
const port = 8812;

app.listen(port, function() {
    console.log("Listening on " + port);
});

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
    const receivedID = req.query.id;
    const person = findPersonById(receivedID);
    const IdsOfFriends = person.friends;

    var friendsJson;

    // the following code is very suspicious... as suspicious as chess camp kids
    // hope nobody reads it before it's rewritten.

    if (IdsOfFriends.length==0) {
        return res.send("[]");
    } else
        if (IdsOfFriends.length==1) {
            friendsJson = "[" + JSON.stringify(findPersonById(IdsOfFriends[0])) + "]";
            res.send(friendsJson);
        } else
            for (var i=0; i<IdsOfFriends.length; i++) {
                // if first
                if (i == 0) {
                    friendsJson = "[" + JSON.stringify(findPersonById(IdsOfFriends[i]));
                    continue;
                }

                // if anything inbetween
                if (i !== IdsOfFriends.length -1 && i !== 0) {
                    friendsJson = friendsJson.concat(",");
                    friendsJson = friendsJson.concat(JSON.stringify(findPersonById(IdsOfFriends[i])));
                }

                // if last
                if (i == IdsOfFriends.length - 1) {
                    friendsJson = friendsJson.concat(",");
                    friendsJson = friendsJson.concat (JSON.stringify(findPersonById(IdsOfFriends[i])));
                    friendsJson = friendsJson.concat("]");
                    break;
                }
            }

    console.log(port + ": requested friends of " + person.firstName +
        " " + person.surname + " (id = " + person.id + ")");
    return res.send(friendsJson);

}
function getFriendsOfFriends (req, res) {
    var personID = req.query.id;
    var person = findPersonById(personID);
    const IdsOfFriends = person.friends;

    var IdsOfFriendsOfFriends = [];

    for (var i = 0; i<IdsOfFriends.length; i++) {
        var currentFriend = findPersonById(IdsOfFriends[i]);
        for (var j = 0; j<currentFriend.friends.length; j++) {
            if (IdsOfFriendsOfFriends.includes(currentFriend.friends[j]))
                continue;
            else
                IdsOfFriendsOfFriends.push (currentFriend.friends[j]);
        }
    }

    var arrayOfFriendsOfFriends = [];
    for (var k = 0; k<IdsOfFriendsOfFriends.length; k++) {
        arrayOfFriendsOfFriends.push(findPersonById(IdsOfFriendsOfFriends[k]));
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

// utility funct

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


app.get('/', rootHandler);

app.post('/getall', getAll);
app.post('/getinfo', getInfo);
app.post('/getfriends', getFriends);
app.post('/getfriendsoffriends', getFriendsOfFriends);
app.post('/getsuggested', getSuggestedFriends);














