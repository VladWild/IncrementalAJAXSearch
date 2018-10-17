const method = "GET";
const url = "http://localhost:3000/db";

function JSONServerConnection() {
    return new Promise(function(succeed, fail) {
        let request = new XMLHttpRequest();
        request.open(method, url, true);
        request.addEventListener("load", function() {
            if (request.status < 400)
                succeed(request.response);
            else
                fail(new Error("Request failed: " + request.statusText));
        });
        request.addEventListener("error", function() {
            fail(new Error("Network error"));
        });
        request.send();
    });
}



