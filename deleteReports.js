const fs = require("fs");

fs.access("./cypress/reports", function(error) {
    if (error) {
    } else {
        fs.rmSync("./cypress/reports", {recursive: true});
    }
})


