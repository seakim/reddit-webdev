# reddit-webdev
RCB-HW15 (full-stack with MongoDB, Mongoose, Node, Express, Cheerio, and Axios )

* "/scrape" scrapes data from "https://old.reddit.com/r/webdev/" and save them into mongoDB.
    * data include: link, title, submittedBy, rank, score, and number of comments
* When user clicks An article card, note pages show up on the right side.
* When user clicks `save note` after putting title and body, an instance of note is created and listed below the form.
    * The relationship between article and notes is 1 to N.
* When the user clicks `Delete` button, the note will be removed.