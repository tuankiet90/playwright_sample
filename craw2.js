const { firefox } = require("playwright");
const link = "https://dune.com/cryptokoryo/friendtech";

const mongoose = require(`mongoose`);
const { isAddress } = require("ethers");
const connectString =
"mongodb+srv://amm:C6n719Sk5V3Kc8s4@db-mongodb-sgp1-rasset-fb6a1567.mongo.ondigitalocean.com/amm?tls=true&authSource=admin&replicaSet=db-mongodb-sgp1-rasset";
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

const delay = async (time,text="") => {
  for (let i = 0; i <= time; i++) {
    console.log(`wait ${text}....${i}`);
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
      await delay(10,'load page');

      await web.screenshot({ path: "xxxxxx.png" });
      const rows = await web.locator(".db-table-row").all();
      for (const row of rows) {
        total++;
        const texts = (await row.allInnerTexts()).toString().split(`\n`);
        const rank = +texts[0];
        const user = texts[1];
        const net_worth = texts[2];
        const tvf = texts[3];
        const followers = +texts[4];
        let address,
          profile_url = "";
        const imgStr = (
          await row.locator(`.db-user-avatar-container`).first().innerHTML()
        ).toString();
        address = imgStr
          .replace(`<img src="https://static.debank.com/image/user/logo/`, "")
          .split("/")[0];
        profile_url = "";
        if (address && isAddress(address)) {
          profile_url = `https://debank.com/profile/${address}`;
        } else {
          // const cells = await row.locator(".db-table-cell").all();

          // if (user == "nerd") {
          //   await row.locator(".db-user-avatar-container-wrapper").hover();
          //   await delay(2);
          //   await web.screenshot({ path: `${user}.png` });
          //   await row.locator(".db-user-avatar-container-wrapper").click();
          //   isContinue = false;
          //   process.exit();
          // }
          try {
            await row.locator(".db-user-avatar-container-wrapper").click();
            await delay(5,'row ');
            const pages = await web.context().pages();

            profile_url = await pages[1].url();
            address = profile_url
              .replace(`https://debank.com/profile/`, "")
              .split("/")[0];

          } catch (error) {
            console.log(error.message);
          }
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
      await delay(60,` next page `)
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

start();

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

  workbook.xlsx
    .writeFile("./users-debank.csv")
    .then(() => console.log("File saved!"));
}

//exportExcel();
