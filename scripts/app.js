// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var monthly_quakes_endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
let endpoint;
let time = new Date();
// console.log('checking the date: ', time);
let timeInUnix = time.getTime();
// console.log('time in Unix: ', timeInUnix);
let clickCount = 0;
$(document).ready(function() {
  // set outHTML variable
  let outHTMLWeek = function (){
    $('.container').append(`
      <div class="row">
        <div class="col-md-6">
          <div id="map"></div>
            </div>
              <div class="col-md-6">
                <div id="info">
                  <h1>Earthquakes from the past week:</h1>
                  <p class='append-eq-here'></p>
                </div>
            </div>
        </div>
    </div>`
    );
  }
  // change the h1 to month
  let changeToMonth = function (){
    $('h1').html(`<h1>Earthquakes from the past month:</h1>`)
  }
  // appened all the new p tags
  let newHTML = function (eqTital, eqHours) {
    $('.append-eq-here').append(`
                  <p>${eqTital} / ${eqHours} hours ago</p>
    `);
  };

  // run outHTMLWeek first to create the HTM shell
  outHTMLWeek();

  // set endpoint to the weekly option as default
  endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

  // on click keep a counter that tells you if it is month or week
  // by default it is week so on odd (first click) switch it to month

  $('.switch').on('click', function(){
    clickCount++;
    if ( clickCount % 2 !== 0 ) {
      endpoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
      // remove everything after the row and then rerun everything to create the website again
      $(".row").remove();
      outHTMLWeek();
      changeToMonth();
      earthquakerParser();
    } else {
      endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
      $(".row").remove();
      outHTMLWeek();
      earthquakerParser();
    }
  });

  // earthquakerParser runs to do the following:
    // create the initial list of all the earthquakes
    // add map (google map)
  // by default start with adding weekly
  let earthquakerParser = function (){
  $.ajax({
    type: 'GET',
    url: endpoint
  })
  .then(function(earthquakeData) {
    // use the forEach to create the title and the lat long
    // earthquakeInfo is the iterator ==> for earthquakeData.features

    earthquakeData.features.forEach(function (earthquakeInfo) {
      console.log('This is earthquakInfo: ',earthquakeInfo);
      let hoursAgo = Math.floor((timeInUnix - earthquakeInfo.properties.updated)/3600000);

      // https://stackoverflow.com/questions/4092325/how-to-remove-part-of-a-string-before-a-in-javascript
      // removing of and then space
      let earthquakeTitle = earthquakeInfo.properties.title;
      earthquakeTitle = earthquakeTitle.substring(earthquakeTitle.indexOf('of ') +3)

      newHTML(earthquakeTitle, hoursAgo);
    let lat = earthquakeInfo.geometry.coordinates[1];
    console.log('lat', lat);
    let long = earthquakeInfo.geometry.coordinates[0];
    console.log('long', long);

    // console log each one to make usre we are brining back the right info
    console.log('Data is coming back: ', earthquakeData);
    // console.log('First earthquake:', earthquakeData.features[0]);
    // console.log('First earthquake title:', earthquakeData.features[0].properties.title);
    // console.log('First earthquake coordinates:', earthquakeData.features[0].geometry.coordinates);
    // console.log('First earthquake latitude:', earthquakeData.features[0].geometry.coordinates[1]);
    // console.log('First earthquake longitude:', earthquakeData.features[0].geometry.coordinates[0]);
    // console.log('First earthquake when did this happen:', earthquakeData.features[0].properties.updated);
    // console.log('First earthquake unix time difference vs earthquake time: ',(timeInUnix - (earthquakeData.features[0].properties.updated)));
    console.log('First earthquake mag:', earthquakeData.features[0].properties.mag);

    });

    // CREATE ME THE MAP
    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: 'terrain'
      });
    };
    // this runs the map
    initMap();

    // this creates the image icons
    var iconBase = 'images/';
    var icons = {
      earthQuake: {
        icon: iconBase + 'earthquake_small.png'
      },
      mediumEarthQuake: {
        icon: iconBase + 'yellowdot.png'
      },
      largeEarthQuake: {
        icon: iconBase + 'reddot.png'
      }
    };


    // run another forEach loop
    // earthquakeInfo is the iterator ==> for earthquakeData.features
    // this set the icon type and the lat lon / properties of each map icon

    earthquakeData.features.forEach(function (earthquakeInfo) {
      console.log('First earthquake mag:', earthquakeInfo.properties.mag);
      if ( earthquakeInfo.properties.mag <= 4.6 ) {
        iconType = icons.mediumEarthQuake.icon;
      } else if ( earthquakeInfo.properties.mag > 4.6 && earthquakeInfo.properties.mag <= 5.5 ) {
        iconType = icons.largeEarthQuake.icon;
      } else if ( earthquakeInfo.properties.mag > 5.5 ) {
        iconType = icons.earthQuake.icon;
        console.log('big quake')
      }
      var title = earthquakeInfo.properties.title;
      console.log('this is the title ', title)
      var latLng = new google.maps.LatLng(`${earthquakeInfo.geometry.coordinates[0]}`, `${earthquakeInfo.geometry.coordinates[1]}`);
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        icon: iconType
      });
    });
  })
  .catch(function(err) {
    console.log('ajax is broke: ', err);
  })
};
earthquakerParser();


});

/*

    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: 'terrain'
      });


    function mapCallBack (earthquakeData.features) {
      for (var i = 0; i < earthquakeData.features.length; i++) {
        // var coords = earthquakInfo[i].geometry.coordinates;
        console.log('CORDS',coords);
        var latLng = new google.maps.LatLng(,earthquakInfo[i].geometry.coordinates[0]);
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
      }
    }
  }

  initMap();
  mapCallBack(earthquakeData.features);




Part 2. Add the title data to the page

Add each title to the page: Loop over your JSON response object, and each title to the page using jQuery. Aim to put each title inside the <div id="info"> section of the page. For example:

<div id="info">
  <p>M 4.2 - 1km ESE of Fontana, California / 123 hours ago </p>
  <p>M 3.1 - 6km SSW of Columbus, Ohio / 77 hours ago </p>
</div>
Pro-tip: When in doubt, work in your Chrome Javascript Console! You can manipulate JSON, test your ideas, and even render elements to the page without ever touching your app.js file!
Switch to Template Literals: We encourage you to use template liteals (with the `). At a certain point it's easier to work with a template than to build HTML strings by hand.




What is the structure of the data?
 // data is an object
How many earthquakes does it list?
 // 60 earth equakes
How would you grab the first earthquake?
 // console.log('First earthquake:', earthquakeData.features[0]);
How would you grab it's title?
 // console.log('First earthquake title:', earthquakeData.features[0].properties.title)
How would you grab it's geological coordinates:
 // console.log('First earthquake coordinates:', earthquakeData.features[0].geometry.coordinates);
latitude?
 // console.log('First earthquake latitude:', earthquakeData.features[0].geometry.coordinates[0]);
longitude?
 // console.log('First earthquake longitude:', earthquakeData.features[0].geometry.coordinates[1]);
When did it happen?
 // console.log('First earthquake when did this happen:', earthquakeData.features[0].properties.time/1000)
How many hours ago is that?
 //

 // $.ajax({
 //   type: 'GET',
 //   url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBHLett8djBo62dDXj0EjCimF8Rd6E8cxg'
 //   // data: {
 //   //   center: {lat: 37.78, lng: -122.44},
 //   //   zoom: 8
 //   // }
 // })
 // .then(function(googleMaps){
 //   console.log('Data is coming back: ', googleMaps);
 // })
 // .catch(function(err) {
 //   console.log('ajax is broken: ', err);
 // });

*/
