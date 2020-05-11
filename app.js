const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector("form");
const streetsEle = document.querySelector(".streets");
const titleBar = document.querySelector("main").firstElementChild;
let streetObject;
let stopArray ;
const tbody = document.querySelector('tbody');

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
        let stopsObject = data.stops;
        for(const key in stopsObject) {
          tbody.innerHTML = "";
          tbody.insertAdjacentHTML('afterbegin', `
          <td>${stopsObject[key].street.name}</td>
            <td>${stopsObject[key]["cross-street"].name}</td>
            <td>${stopsObject[key].direction}</td>
            <td>74</td>
            <td>02:25 PM</td>`)
          console.log(stopsObject[key])
        }
      });
  }
};

form.onsubmit = (event) => {
  const input = event.target.querySelector("input");
  searchBus(input.value);
  event.preventDefault();
};
