/* 
Hailey Thompson 
October 16, 2026
CSC 372-01

This file finds information about TV shows from TV maze and displays it.
*/



//grabbing my html 
let searchForm = document.querySelector("#search-form");
let searchInput = document.querySelector("#search-input");
let message = document.querySelector("#message");
let gallery = document.querySelector("#gallery");


//listen for the click
searchForm.addEventListener("submit", searchShows);

//the default show
searchInput.value = "Blue Bloods";
searchShows();

//making the function 
//This function searches and displays information about TV shows found from TVmaze. 
async function searchShows(event) {
    if(event){
        event.preventDefault();
    }

    const searchText = searchInput.value.trim();
    const apiUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchText)}`;

    //replacing the cards with every search
    gallery.replaceChildren();


    if (searchText === "") {
        message.textContent = "No result for empty text";
        return;
    }
    message.textContent = "Loading your show.....";

    try {
        const response = await fetch(apiUrl);

        if(response.status === 429){
            throw new Error("Too many requests at one time. Please try again.");
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        //response -> json
        const shows = await response.json();

        //keep the first 10
        const firstTenShows = shows.slice(0, 10);

        //if there are no matching shows 
        if (firstTenShows.length === 0) {
            message.textContent = "No Shows found with that search word. Please try another one."
            return;
        }

        //clearing loading...
        message.textContent = "";

        //loop through all of the shows ()
        for (let i = 0; i < firstTenShows.length; i++) {
            const matchingShow = firstTenShows[i].show;

            //cast
            const castUrl = `https://api.tvmaze.com/shows/${matchingShow.id}/cast`;

            //if cast request fails
            let cast = [];

            try{
                const castResponse = await fetch(castUrl);

                if (!castResponse.ok) {
                    throw new Error(`HTTP ${castResponse.status}`);
                }

                cast = await castResponse.json();
            }
            catch(error){
                console.log("Error loading caast: ", error);
            }

            //making the card 
            const showCard = document.createElement("div");
            showCard.classList.add("show-card");



            //show title
            const showTitle = document.createElement("h2");
            showTitle.textContent = matchingShow.name;

            //show summary
            const showSummary = document.createElement("p");

            if (matchingShow.summary) {
                showSummary.textContent = matchingShow.summary.replace(/<[^>]*>/g, "");
            }
            else {
                showSummary.textContent = "Summary not Available"
            }

            //premier date 
            const premierDate = document.createElement("p");
            if (matchingShow.premiered) {
                premierDate.textContent = "Premiere Date: " + matchingShow.premiered;
            }
            else {
                premierDate.textContent = "Premiere Date: Not Available";
            }

            //last updated 
            const lastUpdated = document.createElement("p");
            if (matchingShow.updated) {

                //making the time readable
                const gettingTime = new Date(matchingShow.updated * 1000);
                lastUpdated.textContent = "Last Updated: " + gettingTime.toLocaleString();
            }
            else {
                lastUpdated.textContent = "Last Updated: Not Available";
            }

            //Generes
            const genres = document.createElement("p");
            if (matchingShow.genres && matchingShow.genres.length > 0) {
                genres.textContent = "Genre: " + matchingShow.genres.join(", ");

            }
            else {
                genres.textContent = "Genre: Not Available";
            }

            //rating 
            const rating = document.createElement("p");
            if (matchingShow.rating && matchingShow.rating.average != null) {
                rating.textContent = "Average Rating: " + matchingShow.rating.average;

            }
            else {
                rating.textContent = "Average Rating: Not Available";
            }

            //displaying cast information

            //main cast 
            const castMembers = document.createElement("p");

            //getting the first 3 cast members 
            const firstThreeCast = cast.slice(0, 3);

            if (firstThreeCast.length > 0) {
                let castNames = "";


                for (let j = 0; j < firstThreeCast.length; j++) {
                    castNames += firstThreeCast[j].person.name;

                    //place a comma to make it pretty
                    if (j < firstThreeCast.length - 1) {
                        castNames += ", ";
                    }
                }
                //put it into the p
                castMembers.textContent = "Main Cast: " + castNames;
            }
            else{
                castMembers.textContent = "Main Cast: Not Available";
            }

            //TVmaze link
            const showLink = document.createElement("a");

            showLink.textContent = "View on TVmaze";

            if(matchingShow.url){
                showLink.href = matchingShow.url;
            }
            else{
                showLink.textContent = "Show Link: Not Available";
            }

            //put the link onto a new page
            showLink.target = "_blank";

            //title inside card 
            showCard.appendChild(showTitle);
            showCard.appendChild(showSummary);
            showCard.appendChild(premierDate);
            showCard.appendChild(lastUpdated);
            showCard.appendChild(genres);
            showCard.appendChild(rating);
            showCard.appendChild(castMembers);
            showCard.appendChild(showLink);

            //put card into gallery 
            gallery.appendChild(showCard);



        }

    }

    catch (error) {
        message.textContent = "Error loading shows";
        gallery.replaceChildren();
    }



}