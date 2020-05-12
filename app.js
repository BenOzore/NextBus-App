const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector("form");
const streetsEle = document.querySelector(".streets");
const titleBar = document.querySelector("main").firstElementChild;
const tbody = document.querySelector('tbody');
let streetObject;
let streetKey;
let stopsObject;
let stopScheduleObject;
let x = [];

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

streetsEle.onclick = (event) => {
  if (event.target.nodeName === "A") {
    streetKey = event.target.dataset.streetKey;
    fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${apiKey}`)
      .then((resp) => resp.json())
      .then((data) => {
        stopsObject = data.stops;
        console.log(stopsObject[0].key)
      fetch(`https://api.winnipegtransit.com/v3/stops/${stopsObject[0].key}/schedule.json?max-results-per-route=1&api-key=${apiKey}`)
      .then((resp) => resp.json())
      .then((data) => {
        stopScheduleObject = data;
        console.log(stopScheduleObject['stop-schedule']['route-schedules'][0]['scheduled-stops'][0].times['departure']['scheduled']);
        titleBar.innerHTML = "";
        titleBar.insertAdjacentHTML("afterbegin", `
          <div id="street-name" class="titlebar">
          Displaying results for ${stopsObject[0].street.name}
          </div>
        `)
        for (const key in stopsObject) {
          tbody.innerHTML = "";
          tbody.insertAdjacentHTML('afterbegin', `
          <td>${stopsObject[key].street.name}</td>
            <td>${stopsObject[key]["cross-street"].name}</td>
            <td>${stopsObject[key].direction}</td>
            <td>74</td>
            <td>${stopScheduleObject['stop-schedule']['route-schedules'][0]['scheduled-stops'][0].times['departure']['scheduled']}</td>`)
        }
      })
    })
  }
};

form.onsubmit = (event) => {
  const input = event.target.querySelector("input");
  searchBus(input.value);
  event.preventDefault();
};
