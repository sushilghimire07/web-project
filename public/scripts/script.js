document.querySelector("#searchBtn").addEventListener("click", function() {
    const city = document.querySelector("#city").value;
    if (city) {
        window.location.href = `/weather?city=${city}`;
    } else {
        alert("Please enter a city name");
    }
});
