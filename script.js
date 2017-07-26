//regular streaming users; 
var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


// data declaration: 
var img = "";
var name = "";
var link = "#";
var status = "";
var content = "";
var i = 0;
var URL = "https://wind-bow.glitch.me/twitch-api/";

//function peform ajax jquery request to retrieve data
getStream(channels[i]);


/* function define */
function getStream(channel) {
    if (channel === channels[channels.length]) {
        return; //getting out of array when recurse to final channel
    }

    //let ajax requests in order with when , then 
    $.when(

        //Now check for offline channels
        $.ajax({
            type: "GET",
            url: URL + "streams/" + channel + "?callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function(offline) {
                status = offline.stream === null ? "offline" : status;

            }
        }),

        //request json data for channel to retrive online data
        $.ajax({
            type: "GET",
            url: URL + "channels/" + channel + "?callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function(data) {
                img = data.logo === null ? "#" : data.logo;
                link = data.url;
                name = data.display_name;
                status = status === "offline" ? "offline" : data.game + ": " + data.status;
            }
        }),

        // check if channel is not valid
        $.ajax({
            type: "GET",
            url: URL + "users/" + channel + "?callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function(data) {
                status = data.error === "Not Found" ? "User not found" : status;

            }
        }) //ajax calls finnish here


    ).then(function() {

        //set data
        //add head
        content += "<div id = 'content' class='row content stream-data ";

        //add a class "offline" for those are offline channels
        content = status === "offline" ? content + "offline'>" : content + "online'>";

        //add logo
        content += "<div class=\"col-xs-2 logo\"><img src=" + img + "></div>";

        //add link and display name
        content += "<div class=\"col-xs-4 link\"><p><a target=\"_blank\" href=" + link + ">" + name + "</a></p></div>";

        //add status
        content += "<div class=\"col-xs-6+\"><p>" + status + "</p></div></div>";
        $("#streamers").append(content);

        //clear content for next channels
        content = "";

        //recursing for next  channels
        getStream(channels[++i]);

    });

};



function getAll() {
    $('.offline').show("fast");
    $('.online').show("fast");
}

function getOnline() {

    $('.offline').hide("fast");
    $('.online').show("fast");

}

function getOffline() {

    $('.online').hide("fast");
    $('.offline').show("fast");
}