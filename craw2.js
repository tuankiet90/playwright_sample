const { firefox } = require("playwright");
const link = "https://dune.com/cryptokoryo/friendtech";

const mongoose = require(`mongoose`);
const { isAddress } = require("ethers");
const connectString =
  "mongodb://127.0.0.1:27000,127.0.0.1:27001,127.0.0.1:27002/debank&replicaSet=rs0";
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
    address: String,
    profile_url: String,
    net_worth: String,
    tvf: String,
    followers: Number,
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

  let isContinue = true;
  let total = 0;
  let page = 1;
  //xxx
  while (isContinue) {
    try {

      let link = `https://debank.com/ranking?page=${page}`;
      const web = await browser.newPage();
      console.log({ link, page, total });
      await web.goto(link);
      await delay(3);

      const rows = await web.locator(".db-table-row").all();
      for (const row of rows) {
        total++;
        const texts = (await row.allInnerTexts()).toString().split(`\n`);
        const rank = +texts[0];
        const user = texts[1];
        const net_worth = texts[2];
        const tvf = texts[3];
        const followers = +texts[4];
        const imgStr = (
          await row.locator(`.db-user-avatar-container`).first().innerHTML()
        ).toString();
        const address = imgStr
          .replace(`<img src="https://static.debank.com/image/user/logo/`, "")
          .split("/")[0];
        let profile_url = "";
        if (isAddress(address)) {
          profile_url = `https://debank.com/profile/${address}`;
        }

        // console.log({ rank, user, net_worth, tvf, followers });
        await userModel.create([
          {
            rank,
            user,
            net_worth,
            tvf,
            followers,
            profile_url,
            address: isAddress(address) ? address : null,
          },
        ]);
        if (page >= 200) {
          isContinue = false;
        }
      }
      await web.close();
      page++;
    } catch (error) {
      console.log(error);
    }
  }
  console.log("end");
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
  const users = await userModel.find().sort({ rank: 1 }).limit(10000);
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

  workbook.xlsx.writeFile("./users-debank.csv").then(() => console.log("File saved!"));
}

exportExcel();
