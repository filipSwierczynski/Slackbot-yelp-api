//"StAuth10065: I Filip Swierczynski 000348007 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."

var Bot = require('slackbots');
var axios = require('axios');

var settings = {
    token: 'YourSlackBotToken',
    name: 'yelphelp'
};


var yelpToken = 'YelpApiToken';


var bot = new Bot(settings);

//On start of application
bot.on('start',()=>{
    bot.postMessageToChannel('general','Hi, ask me about local restaurants.');
});

function message(input) {

    var request = input.toLowerCase();

    if (request.includes('nearby')) {
        nearby(request);
    }
    else if (request.includes('closeby')) {
        closeby(request);
    }
    else if (request.includes('top')) {
        top(request);
    }
    else if (request.includes('closest')) {
        closest(request);
    }
    else if (request.includes('findme')) {
        findme(request);
    }
    else if (request.includes('reviews')) {
        reviews(request);
    }
    else if (request.includes('searchbyphone')) {
        searchByPhone(request);
    }else if(request.includes('status')){
        status(request);
    }
}

bot.on('message', function(data) {
    if (data.type !== 'message') {
        return;
    }
    message(data.text);
});

bot.on('error', function(error) {
    console.log(error);
});




function nearby(req){
    var location = '';
    var data = req.split(',');
    var address = data[0].replace('nearby ','');
    var city = data[1];
    var province = data[2];
    location = address + ', ' + city + ', ' + province;

    axios.get('https://api.yelp.com/v3/businesses/search',{
        headers: {
            Authorization: 'Bearer ' + yelpToken
        },
        params:{
            location: location,
            radius: 10000
        }
    }).then(res=>{
        var res_length = res.data.businesses.length;
        if(res_length == 0){
            bot.postMessageToChannel('general','No nearby restaurants can be found.');
        } else {
            var businesses = [];

            for(var i = 0;i<5;i++){
                businesses.push(res.data.businesses[i])
            }
            var output_string = '';

            for(var i = 0;i< businesses.length;i++){
                output_string += businesses[i].name + '\n' + businesses[i].location.address1 + ', ' + businesses[i].location.city + ', ' + businesses[i].location.state + '\n\n';
            }

            bot.postMessageToChannel('general',output_string);
        }
    }).catch(err=>{
        console.log(err);
        
    });
}

function closeby(req){
    var data = req.split(" ");
    var longitudeCords = data[2];
    var latitudeCords = data[3];
  //  console.log(typeof(longitudeCords));
    
  var isSInLong = longitudeCords.includes("s");
  var isWInLat = longitudeCords.includes("w");
  
  if(isSInLong){
      longitudeCords = "-" + longitudeCords;
      longitudeCords.replace('s',"");
  }else{
    longitudeCords.replace('n',"");
  }
//Could not get it to work, keep getting an error with cannot read property 'replace' of undefinded. Same thing happen

  if(isWInLat){
      latitudeCords = "-" + latitudeCords;
      latitudeCords.replace('w',"");
  }else {
    latitudeCords.replace('e',"");
  }
  

  
    axios.get('https://api.yelp.com/v3/businesses/search',{
        headers: {
            Authorization: 'Bearer ' + yelpToken
        },
        params:{
            latitude: latitudeCords,
            longitude: longitudeCords,
            radius: 10000
        }
    }).then(()=>{
        var res_length = res.data.businesses.length;
        
        
        if(res_length == 0){
            bot.postMessageToChannel('general','No nearby restaurants');
        } else {
            var businesses = [];
            for(var i = 0;i<5;i++){
                businesses.push(res.data.businesses[i]);
            }

            var output = '';
            for(var i = 0;i<businesses.length;i++){
                output += businesses[i].name + '\n' + businesses[i].location.address1 + ', ' + businesses[i].location.city + ', ' + businesses[i].location.state + '\n';
            }
            
            bot.postMessageToChannel('general',output);
            }
        
    }).catch(err=>{
        console.log(err);
        
    });
 }



function top(req){

    var split1 = req.split(',');
    var split2 = split1[0].split(" ");

    var count = split2[1];
    var city = split1[1].trim(" ");
    
    var province = split1[2].trim(" ");
   
    split2.splice(0,2);
    var arrToString = split2.toString();
    var address = arrToString.replace(/,/g," ");
    var location = address + ", " + city + ", " + province;
    
    axios.get('https://api.yelp.com/v3/businesses/search',{
        headers: {
            Authorization: 'Bearer ' + yelpToken
        }, params: {
            location: location,
            limit: count,
            sort_by: "rating",
            radius: 10000
        }
    }).then(res=>{
        var response_length = res.data.businesses.length;

        if(response_length == 0){
            bot.postMessageToChannel('general',"No nearby restaurants can be found");
        }
        else {
            var businesses = [];
        
            for (var i = 0; i < response_length; i++) {
                businesses.push(res.data.businesses[i])
            }
            
            var output = '';

            for (var i = 0; i < businesses.length; i++) {
                output += businesses[i].name + '\n' + businesses[i].location.address1 + ', ' + businesses[i].location.city + ', ' + businesses[i].location.state + '\n\n';
            }

            bot.postMessageToChannel('general',output);
        }
    }).catch(err=>{
        console.log(err);
        
    });
}


function closest(req){
    var split1 = req.split(',');
    var split2 = split1[0].split(" ");
    var count = split2[1];
    var city = split1[1].trim(" ");
    var province = split1[2].trim(" ");

    split2.splice(0,2);
    var arrToString = split2.toString();
    var address = arrToString.replace(/,/g," ");
    var location = address + ", " + city + ", " + province;

    axios.get('https://api.yelp.com/v3/businesses/search',{
        headers:{
            Authorization: 'Bearer ' + yelpToken
        }, params: {
            location: location,
            limit: count,
            sort_by: "distance"
            
        }
        }).then(res=>{
            var res_length = res.data.businesses.length;
            if(res_length == 0){
                bot.postMessageToChannel('general','No nearby restaurants can be found');
            } else {
                var businesses = [];
                for (var i = 0;i<res_length;i++){
                    businesses.push(res.data.businesses[i]);
                }
                var output = '';
                for (let index = 0; index < businesses.length; index++) {
                    output += businesses[index].name + ", " + businesses[index].location.address1 + ", " + businesses[index].location.city + ", " + businesses[index].location.state + '\n\n';
                    
                }
                bot.postMessageToChannel('general',output);
            }
            
        }).catch(err=>{
            console.log(err);
    });
}

function findme(req){
   var split1 = req.split(',');
   var split2 = split1[0].split(" ");

   var category = split2[1].toLowerCase().trim(" ");
   var city = split1[1].trim(" ");
   var province = split1[2].trim(" ");
   
   

   split2.splice(0,2);
   var arrToString = split2.toString();
   var address = arrToString.replace(/,/g," ");
   var location = address + ", " + city + ", " + province;
  // console.log(category,city,province,address);

   axios.get('https://api.yelp.com/v3/businesses/search',{
       headers:{
           Authorization: 'Bearer ' + yelpToken
       }, params: {
           location: location,
           categories: category,
           radius: 20000
       }
   }).then(res=>{
    var res_length = res.data.businesses.length;

    if(res_length == 0){
        bot.postMessageToChannel('general',"No " + category + " restaurants can be found.");
    } else {
        var businesses = [];

        for (var i = 0; i < res_length; i++){
            businesses.push(res.data.businesses[i]);
            
        }
       // console.log(businesses);
        
        
        var output = '';

        for (var i =0;i<businesses.length;i++){
            output +=  businesses[i].name + '\n' + businesses[i].location.address1 + ', ' + businesses[i].location.city + ', ' + businesses[i].location.state + "\nRating: " + businesses[i].rating + '\n\n';
        }

        bot.postMessageToChannel('general',output);
    }
   }).catch(err=>{
       console.log(err);
       
   });

}


function reviews(req){
    var split1 = req.split(",");
    var split2 = split1[0].split(" ");
    var regEx = /reviews\s([a-zA-Z\s']+)/;
    
    var businessName = regEx.exec(req);
    var restaurant = businessName[1];

    var city = split1[1].trim(" ");
    var province = split1[2].trim(" ");
    split2.splice(0,2);
    var arrToString = split2.toString();
    var address = arrToString.replace(/,/g," ");
    var location = address + ", " + city + ", " + province;

    console.log(restaurant);
    
    axios.get('https://api.yelp.com/v3/businesses/search',{
        headers:{
            Authorization: 'Bearer ' + yelpToken
        }, params:{
            location: location,
            term: restaurant,
            limit: 3,
            sort_by: 'distance'
        }
    }).then(res=>{
        var res_length = res.data.businesses.length;

        if(res_length == 0){
            bot.postMessageToChannel('general', restaurant + ' cannot be found.');

        } else {
            id = res.data.businesses[0].id;

            axios.get('https://api.yelp.com/v3/businesses/'+ id +'/reviews',{
                headers:{
                    Authorization: 'Bearer ' + yelpToken
                }
            }).then(res=>{
                var reviews = [];

                for(review of res.data.reviews){
                    reviews.push(review)
                }

                var output = '';
                for(var i =0;i<reviews.length;i++){
                    output += reviews[i].text + '"\n\n' + "Username : " + reviews[i].user.name + '\nRating : ' + reviews[i].rating + '\nFull review link : ' + reviews[i].url + "\n\n--------------------------------------------------------------\n\n";
                }

                bot.postMessageToChannel('general',output);

            }).catch(err=>{
                console.log(err);
                
            });
        }
    }).catch(err=>{
        console.log(err);
    });
}


function searchByPhone(req){
    var split1 = req.split(" ");
    var phoneNum = "+" + split1[1];
    //console.log(phoneNum);
    axios.get('https://api.yelp.com/v3/businesses/search/phone',{
        headers: {
            Authorization: 'Bearer ' + yelpToken
        },
        params: {
            phone: phoneNum
        }
    }).then(res=>{
        var res_length = res.data.businesses.length;

        if(res_length == 0){
            bot.postMessageToChannel('general',' No restaurant with phone number' + phoneNum + " can be found.");
        } else {
            var restaurants = [];

            for (var i = 0; i < res_length;i++){
                restaurants.push(res.data.businesses[i])
            }

            var output = "";

            for (var i = 0;i< restaurants.length;i++){
                output += "Restaurant Name: " + restaurants[i].name + "\nAddress: " + restaurants[i].location.address1 +", " + restaurants[i].location.city + ", " + restaurants[i].location.state + "\n\n";
            }
            bot.postMessageToChannel('general',output);
        }
        
    }).catch(err=>{
        console.log(err);
        
    });


}





