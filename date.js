//we made anonymous fun rather than creating var and passing var and insted of module.exports.gatDate we can smiply use exports (node.js documentation reference)
exports.getDate = function () {
    const today = new Date(); //it will give us todays date
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };


    const day = today.toLocaleDateString("en-US", options);
    return day;
};

//we made it multi functional now we can get two types of information from this module

exports.getDay = function () {
    const today = new Date(); //it will give us todays date
    const options = {
        weekday: "long",

    };


    const day = today.toLocaleDateString("en-US", options);
    return day;
};