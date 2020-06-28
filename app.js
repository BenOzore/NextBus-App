const apiKey = `zqAH1xZnEZviNZHUaz6`;
const formEle = document.querySelector('form');
const streetsEle = document.querySelector('.streets');

const tbody = document.querySelector('tbody');

formEle.onsubmit = e => {
  const input = e.target.querySelector('input');
  getStreets(input.value);
  input.value = "";
  e.preventDefault();
}

streetsEle.onclick = e => {
  if (e.target.nodeName === "A") {
    getStops(e.target.dataset.streetKey);
  }
}

function getStreets(query) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${query}`)
    .then(resp => resp.json())
    .then(data => {
      insertStreets(data.streets);
    });
}

function insertStreets(streets) {
  let streetsHTML = "";

  if (streets.length !== 0) {
    streets.forEach(street => {
      streetsHTML += `<a href="#" data-street-key="${street.key}">${street.name}</a>`;
    });
  } else {
    streetsHTML = `<div class="no-results">No results found</div>`;
  }

  streetsEle.innerHTML = streetsHTML;
}

function getStops(streetKey) {
  fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}&street=${streetKey}`)
    .then(resp => resp.json())
    .then(data => {
      getSchedules(data.stops);
    });
}

function getSchedules(stops) {
  const stopSchedules = [];
  stops.forEach(stop => {
    stopSchedules.push(fetch(`https://api.winnipegtransit.com/v3/stops/${stop.key}/schedule.json?api-key=${apiKey}&max-results-per-route=1&usage=long`)
      .then(resp => resp.json())
      .then(data => {
        return data['stop-schedule'];
      }));
  })

  Promise.all(stopSchedules).then(stopSchedules => {
    tbody.textContent = "";
    stopSchedules.forEach(stopSchedule => {
      insertSchedules(stopSchedule);
    });
  });
}

function insertSchedules(stopSchedules) {
  stopSchedules['route-schedules'].forEach(route => {
    const departureTime = new Date(route['scheduled-stops'][0].times.departure.estimated);
    console.log(stopSchedules)
    tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td>${stopSchedules.stop.street.name}</td>
        <td>${stopSchedules.stop['cross-street'].name}</td>
        <td>${stopSchedules.stop.direction}</td>
        <td>${route.route.number}</td>
        <td>${departureTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
      </tr>
    `)}
    )
  }
  
