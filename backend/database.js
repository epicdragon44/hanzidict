var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

var LineByLineReader = require("line-by-line"),
    lr = new LineByLineReader("IDS.TXT");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log("Connected to the SQLite database.");
        db.run(
            `CREATE TABLE hantable(
            id INTEGER PRIMARY KEY,
            hanchar TEXT NOT NULL, 
            hanrad TEXT NOT NULL
        );`,
            (err) => {
                if (err) {
                    // Table already exists
                    console.log(
                        "Table already exists. Backend is ready; no data imported."
                    );
                    console.error(err.message);

                    // Drop table
                    // db.run(`DROP TABLE hantable;`, (err) => {
                    //     if (err) {
                    //         console.error(err.message);
                    //         throw err;
                    //     }
                    // });
                } else {
                    console.log(
                        "Table created. Importing data from IDS.TXT...this may take an extremely long time..."
                    );

                    lr.on("error", function (err) {
                        console.log("Error reading file:", err);
                    });

                    lr.on("line", function (line) {
                        // Disregard informational lines
                        if (line.startsWith("#")) {
                            return;
                        }

                        // Split line into fields
                        let fields = line.split("\t");
                        let hanchar = fields[1];

                        // Specify all non-radical parts of the second field
                        let radstr = fields[2];
                        let nonAllowed = [
                            "？",
                            "⿰", // TODO: use these to render radical positions eventually
                            "⿱",
                            "⿲",
                            "⿳",
                            "⿴",
                            "⿵",
                            "⿶",
                            "⿷",
                            "⿸",
                            "⿹",
                            "⿺",
                            "⿻",
                            "〾",
                            "↔",
                            "↷",
                            "⊖",
                        ];
                        for (let i = 0; i <= 70; i++) {
                            // TODO: replace these with images of the non-representable-in-unicode radical in question
                            // Insert {01} to {70} into the array of nonAllowed
                            let strNum = i.toString();
                            if (strNum.length === 1) {
                                strNum = "0" + strNum;
                            }
                            nonAllowed.push("{" + strNum + "}");
                        }

                        // Remove non-radical parts of the second field
                        for (let i = 0; i < nonAllowed.length; i++) {
                            radstr = radstr.replace(nonAllowed[i], "");
                        }

                        // Take the substring of the field between ^ and $: that should be a string of consecutive radicals
                        let radstr2 = radstr.substring(
                            radstr.indexOf("^") + 1,
                            radstr.indexOf("$")
                        );

                        // Split the string of radicals into an array of radicals
                        let rads = radstr2.split("");

                        // For each radical in the array, insert it into the database
                        for (let i = 0; i < rads.length; i++) {
                            let rad = rads[i];
                            let sql =
                                "INSERT INTO hantable (hanchar, hanrad) VALUES (?, ?)";
                            let params = [hanchar, rad];
                            db.run(sql, params, (err) => {
                                if (err) {
                                    console.error(err.message);
                                }
                            });
                        }
                    });

                    lr.on("end", function () {
                        console.log("Finished reading file.");
                    });
                }
            }
        );
    }
});

module.exports = db;
