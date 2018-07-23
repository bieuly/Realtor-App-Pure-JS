import ApiRealtyProvider from './providers/RealtyProvider/ApiRealtyProvider';
import {RealtyData, RealtyDataset} from './models/RealtyData';

(function(){
var url = "http://www.mocky.io/v2/5b2c9e292f00002a00ebd2d7";
var apiResponse: RealtyDataset;
var displayedListings = document.querySelector("#results>tbody");

var numberOfFavorites = document.getElementById("numberOfFavorites");
numberOfFavorites.innerHTML = String(0);
var favorites = new Set();
var favoritesDiv = document.getElementById("favorites");

// Set up filter event listener
var filterInput = <HTMLInputElement>document.getElementById("filter-input");
filterInput.addEventListener("keyup", function(){
    filter(filterInput.value);
});

// Set up filter options
var filterLabel = document.getElementById("filter-button");

// Why do I need to create an array from this? the docs says that the NodeListOf has the forEach method...
// https://github.com/Microsoft/TypeScript/blob/master/src/lib/dom.generated.d.ts
// line 10386
var filterOptionNodes = Array.from(document.querySelectorAll("#filter-dropdown>li>a"));
var currentFilterOption = "id";
filterOptionNodes.forEach(function(option){
    option.addEventListener("click", function(){
        filterLabel.innerHTML = `${option.innerHTML} <span class="caret">`;
        currentFilterOption = option.innerHTML.toLowerCase();
    })
});

function filter(filterTerm) {
    if(filterTerm == "") {
        renderListings(apiResponse);
        return;
    }
    var matchingListingsJson = findMatchingListings(currentFilterOption, filterTerm);
    if(matchingListingsJson.length !== 0) {
        renderListings(matchingListingsJson);
    } else {
         renderListings([]);
    }
}

function renderListings(listings: RealtyDataset = []) {
    displayedListings.innerHTML = createListingsHTML(listings);
    attachFavoritesToggles();
}

function findMatchingListings(filterOption, filterTerm) {
    filterOption = filterOption.toString().toLowerCase();
    return apiResponse.filter((listing)=> listing[filterOption].toString().includes(filterTerm))
}

function toggleFavorites(checked, id) {
    if(!checked && favorites.has(id)) {
        removeFavorite(id);
    } else if(checked) {
        addFavorite(id);
    }
    numberOfFavorites.innerHTML = String(favorites.size);
}

function addFavorite(id) {
    favorites.add(id);
        var favorite = findFavorite(id);
        var newFavoritesEntry = document.createElement("tr");
        newFavoritesEntry.id = id;
        newFavoritesEntry.innerHTML = `
        <td>${id}</td>
        <td>${favorite.price}</td>
        <td>${favorite.bedrooms}</td>
        <td>${favorite.bathrooms}</td>
        <td>${favorite.stories}</td>
        <td>${favorite.type}</td>
        <td>${favorite.year}</td>
        <td><a><span value="${id}" class="glyphicon glyphicon-remove"></span></a></td>
        `;
        favoritesDiv.firstElementChild.appendChild(newFavoritesEntry);
        var removeButton = document.querySelector(`span[value='${id}']`);
        attachRemoveListener(removeButton);
}

function removeFavorite(id) {
    var favoritesEntry = document.getElementById(id);
    if(favoritesEntry !== null) {
        favoritesEntry.parentNode.removeChild(favoritesEntry);
    }
    favorites.delete(id);
    var favoriteCheckbox = <HTMLInputElement>document.querySelector(`input[value=${id}]`);
    if(favoriteCheckbox !== null){
        favoriteCheckbox.checked = false;
    }
}

function findFavorite(id) {
    var favorite = null; 
    apiResponse.forEach(function(entry){
        if(entry.id == id) {
           favorite = entry; 
           return;
        }
    });
    return favorite;
}

function createListingsHTML(listings: RealtyDataset): string {
    if(listings == []) {
        return "";
    } else {
        var result = listings.map((listing: RealtyData) => {
            var result =  `
            <tr id=R${listing.id} class="table-listing">
            <td>${listing.id}</td>
            <td>${listing.price}</td>
            <td>${listing.bedrooms}</td>
            <td>${listing.bathrooms}</td>
            <td>${listing.stories}</td>
            <td>${listing.type}</td>
            <td>${listing.year}</td>`;
            if(favorites.has(listing.id)) {
                result += `<td><input type="checkbox" value="${listing.id}" checked=true"></input></td></tr>`
            } else {
                result += `<td><input type="checkbox" value="${listing.id}"></input></td></tr>`
            }
            return result;
        }).reduce(function(acc, curr){
            return acc + curr
        });
        return result;
    }
}

(async ()=>{
    const realtyProvider = new ApiRealtyProvider();
    apiResponse = await realtyProvider.getRealtyData();
    renderListings(apiResponse);
})();

function attachFavoritesToggles() {
    var inputs = Array.from(document.querySelectorAll("#results>tbody tr input"));
    inputs.forEach(function(input: HTMLInputElement){
        input.onclick = () => toggleFavorites(input.checked, input.value);
    });
}

function attachRemoveListener(button) {
    button.onclick = () => toggleFavorites(false, button.getAttribute("value"));
}

})();
