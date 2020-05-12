const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector("form");
const streetsEle = document.querySelector(".streets");
const titleBar = document.querySelector("main").firstElementChild;
const tbody = document.querySelector("tbody");
let streetObject;
let streetKey;
let stopsObject;
let stopScheduleObject;
const timeFormat = {
  timeZone: "Canada/Central",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
  seconds: "numeric",
};

function searchBus(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}`)
    .then((resp) => resp.json())
    .then((json) => {
      streetObject = json.streets;
      insertIntoStreetList(streetObject);
    });
}

function insertIntoStreetList(data) {
  streetsEle.innerHTML = "";
  data.forEach(function (streetData) {
    streetsEle.insertAdjacentHTML(
      "afterbegin",
      `<a href="#" data-street-key=${streetData.key}>${streetData.name}</a> `
    );
  });
}

//Event Listeners for click and submit
form.onsubmit = (event) => {
  const input = event.target.querySelector("input");
  searchBus(input.value);
  event.preventDefault();
};

streetsEle.onclick = (event) => {
  if (event.target.nodeName === "A") {
    streetKey = event.target.dataset.streetKey;
    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${apiKey}`)
      .then((resp) => resp.json())
      .then((data) => {
        stopsObject = data.stops;
        return fetch(`https://api.winnipegtransit.com/v3/stops/${stopsObject[0].key}/schedule.json?max-results-per-route=1&api-key=${apiKey}`)
          .then((resp) => resp.json())
          .then((data) => {
            stopScheduleObject = data;
            console.log(stopScheduleObject); //stop schedule
            stopsObject.forEach((stops) => {
              console.log(stops);
              let time = stopScheduleObject["stop-schedule"]["route-schedules"][0]["scheduled-stops"][0].times["departure"].estimated;
              tbody.insertAdjacentHTML("afterbegin",`
              <td>${stopsObject[0].street.name}</td>
              <td>${stopsObject[0]["cross-street"].name}</td>
              <td>${stopsObject[0].direction}</td>
              <td>${stopScheduleObject["stop-schedule"]["route-schedules"][0].route.number}</td>
              <td>${new Date(time).toLocaleTimeString("en-US", timeFormat)}</td>`);
            });

            titleBar.innerHTML = "";
            titleBar.insertAdjacentHTML(
              "afterbegin", `
          <div id="street-name" class="titlebar">
          Displaying results for ${stopsObject[0].street.name}
          </div>
          `);
        });
      });
  }
};
