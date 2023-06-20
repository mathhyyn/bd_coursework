let userID = -1;

console.log(userID);

export function getID() {
    return userID
}

export function updateID(newID) {
    userID = newID;
}