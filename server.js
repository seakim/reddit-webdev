const express = require("express")
    , bodyParser = require("body-parser")
    , logger = require("morgan")

const PORT = 3000;
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

require("./controllers/app_controller")(app);

app.listen(PORT, () => console.log("App running on port " + PORT + "!") )
