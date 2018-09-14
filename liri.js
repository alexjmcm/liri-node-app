require("dotenv").config();
var fs = require("fs");
//Grab data from keys.js
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
var parameter = "";
var now = moment().format("MM/DD/YYYY HH:mm:ss:SSS");


//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}
var output = "";
// switch case
switch(command){
  case "concert-this":
      bandsInTown(x);                   
      break;    

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
    //   spotifySong("Nevermind");
      doThing()
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: concert-this, spotify-this-song, movie-this, do-what-it-says}");
  break;
}


function spotifySong(song){  
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name, (error) => {if(error) console.log(error)});
        fs.appendFile('log.txt', songData.name, (error) => {if(error) console.log(error)});
        fs.appendFile('log.txt', songData.preview_url, (error) => {if(error) console.log(error)});
        fs.appendFile('log.txt', songData.album.name, (error) => {if(error) console.log(error)});
        fs.appendFile('log.txt', "-----------------------", (error) => {if(error) console.log(error)});
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&&apikey=trilogy';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);
      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.Ratings[0].Value);
     

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title, (error) =>  {if(error) console.log(error)});
      fs.appendFile('log.txt', "Release Year: " + body.Year,  (error) =>  {if(error) console.log(error)});  
 



      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating,  (error) =>  {if(error) console.log(error)});    
     
      fs.appendFile('log.txt', "Country: " + body.Country,  (error) =>  {if(error) console.log(error)});      
   
      fs.appendFile('log.txt', "Language: " + body.Language, (error) =>  {if(error) console.log(error)});     
     
      fs.appendFile('log.txt', "Plot: " + body.Plot,  (error) =>  {if(error) console.log(error)});  
    
      fs.appendFile('log.txt', "Actors: " + body.Actors,  (error) =>  {if(error) console.log(error)});     
     
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.Ratings[0].Value, (error) =>  {if(error) console.log(error)});         
  
     

    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------", (error) =>  {if(error) console.log(error)});
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/", (error) =>  {if(error) console.log(error)});         
      fs.appendFile('log.txt', "It's on Netflix!", (error) =>  {if(error) console.log(error)});         
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}



function bandsInTown(parameter){
  console.log(parameter);
  
  if (parameter) {
                let queryURL = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp&date=" + moment().format("YYYY-MM-DD") + "," + moment().add(1, "Y").format("YYYY-MM-DD");
                request(queryURL, function (err, response, body) {
                    if (err) {
                        throw err;
                    } else if (response.statusCode === 200) {
                        var result = JSON.parse(body);
                        console.log(result);
                        output+= result[0].lineup.join(", ") + "\n";
                        output += result[0].venue.name + "\n";
                        output += result[0].venue.city + "\n";
                        output += moment(result[0].datetime).format('MM/DD/YY');
                        finish();
                    };
                });
            } else {
                let queryURL = "https://rest.bandsintown.com/artists/ladygaga/events?app_id=codingbootcamp&date=" + moment().format("YYYY-MM-DD") + "," + moment().add(1, "Y").format("YYYY-MM-DD");
                request(queryURL, function (err, response, body) {
                    if (err) {
                        throw err;
                    } else if (response.statusCode === 200) {
                        var result = JSON.parse(body);
                        console.log(result);
                        output += result[0].lineup.join(", ") + "\n";
                        output += result[0].venue.name + "\n";
                        output += result[0].venue.city + "\n";
                        output += moment(result[0].datetime).format('MM/DD/YY');
                        finish();
                    };
                });
            };
}

 function finish() {
        fs.appendFile("log.txt", "\n\n" + now + "\n" + output, function (err) {
            if (err) throw err;
        });
        console.log(output);
    };
