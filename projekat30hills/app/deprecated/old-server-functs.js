// this function was replaced after the initial commit
// it was so bad that I needed to keep it as a fond memory

function getFriendsOld (req, res) {
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
