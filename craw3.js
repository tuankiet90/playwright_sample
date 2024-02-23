const { firefox } = require("playwright");
const link = "https://degenscore.com/beacon/leaderboard";

const mongoose = require(`mongoose`);
const connectString =
  "mongodb://127.0.0.1:27000,127.0.0.1:27001,127.0.0.1:27002/degenscore&replicaSet=rs0";
mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", (err) => {
  console.log("DB connection error:", err.message);
});
const userModel = mongoose.model(
  "users",
  new mongoose.Schema({
    rank: Number,
    user: String,
    score: Number,
    profile_url: String,
  })
);

const waitMs = (msDuration) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, msDuration);
  });
};

const delay = async (time) => {
  for (let i = 0; i <= time; i++) {
    console.log(`wait....${i}`);
    await waitMs(1000);
  }
};

async function read() {
  const browser = await firefox.launch();
  const web = await browser.newPage();
  await web.goto(link);
  await waitMs(5000);

  const ul = await web.getByRole("list");
  const lis = await ul.locator("li").all();

  for (const i of lis) {
    const texts = (await i.allInnerTexts()).toString().split("\n");
    const rank = +texts[0];
    const user = texts[2];
    const score = +texts[4];
    const url = (await i.innerHTML())
      .toString()
      .replace(`<a class="block hover:bg-gray-50/5" href="`, "")
      .split(`"><div`)[0];
    const profile_url = "https://degenscore.com/" + url;
    console.log({ rank, user, score, profile_url });
    await userModel.create([{ rank, user, score, profile_url }]);
  }

  await web.close();
  await browser.close();
}

async function start() {
  try {
    const data = await read();
    console.log({ data });
  } catch (error) {
    console.log(error);
  }
}

//start();

// async function json() {
//   const users = await userModel.find();

//   const data = { users };
//   var fs = require("fs");
//   fs.writeFileSync("users.json", JSON.stringify(data, null, 4));
// }

// json()

async function exportExcel() {
  const users = await userModel.find().sort({ rank: 1 }).limit(5000);
  var Excel = require("exceljs");
  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet("users");
  const columns = [];
  userModel.schema.eachPath(function (path) {
    console.log(path);
    columns.push({ header: path, key: path, width: 50 });
  });
  worksheet.columns = columns;
  for (const user of users) {
    worksheet.addRow(user);
  }

  workbook.xlsx.writeFile("./users-degenscore.csv").then(() => console.log("File saved!"));
}

exportExcel();
