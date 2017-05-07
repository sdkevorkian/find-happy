 This is a site where you can save addresses and search for fun places nearby.


 technologies used
HTML, CSS, Javascript, Node.js, Express.js, Materialize CSS, Google Maps API, Yelp API, Google Geocoder API

 approach taken

 My main approach was to do the functionality first. use limited page layout to test. Read documentation and test small pieces at a time of the APIs and other things I looked up. Then add styling and troubleshoot/add new features slowly.

 1) I started by drawing out my ideas on paper
 2) then I planned out my tables (starting with users and addresses)
 3) tested various searches with yelp api to make sure my goal was feasible
 4) set up login functionality and tested that
 5) set up each route for the addresses page
 6) made main map page where search occurs
 7) introduced favorite functionality, began by planning my table (M:M) and plotting routes
 8) styled each page, and in the process made sure my links between pages and other functionality was as I expected

 here is my trello page that shows the various steps/thoughts I had:  ttps://trello.com/b/dCVTKt1U/find-happy

 installation instructions

To install a local copy of my site you can fork and/or clone the repository.
then, run npm install to grab all the dependencies outlined in the package.json file
then, create a database for the project and run sequelize init. follow the prompts and set up your config file.
run sequlize db:migrate to create the tables/associations/methods involved with the database
run nodemon in the terminal and go to the localhost:3000 in your browser

 user stories

 1) I am going on vacation and want to find fun stuff near by but don't know the location very well. Plus typing the address into yelp or other search places multiple times is annoying.
 2) My friend and I live far away from each other and want to meet up halfway but don't know what is around.

 unsolved problems, etc.

 1) I wanted to make buttons with icons to toggle the search terms on the map, but I was having a hard time getting a click handler attached to ajax to work as I expected. I decided to go with a radio button form instead for now.
 2) since I did go with radio buttons I wanted to make the button for the last searched for term highlight but didn't end up looking that up.
 3) I also couldn't get the birthdate to auto populate the placeholder in the edit-profile form... decided to focus on more important things
