const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector("form");
const streetsEle = document.querySelector(".streets");
const titleBar = document.querySelector("main").firstElementChild;
let streetObject;
let stopArray ;

function searchBus(query) {
  fetch(
    `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}`
  )
    .then((resp) => resp.json())
    .then((json) => {
      streetObject = json.streets;
      insertIntoStreetEle(streetObject);
    });
}

function insertIntoStreetEle(data) {
  streetsEle.innerHTML = "";
  data.forEach(function (street) {
    streetsEle.insertAdjacentHTML(
      "afterbegin",
      `<a href="#" data-street-key=${street.key}>${street.name}</a> `
    );
  });
}

streetsEle.onclick = (event) => {
  if (event.target.nodeName === "A") {
    stopArray = event.target.dataset.streetKey;
    fetch(
      `https://api.winnipegtransit.com/v3/stops.json?street=${stopArray}&api-key=${apiKey}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        for(const key in data.stops) {
          console.log(data.stops[key]);
        }
      });
  }
};

form.onsubmit = (event) => {
  const input = event.target.querySelector("input");
  searchBus(input.value);
  event.preventDefault();
};
