const apiKey = `zqAH1xZnEZviNZHUaz6`;
const form = document.querySelector('form');

fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=henlow`)
.then(resp => resp.json())
.then(json => console.log(json));