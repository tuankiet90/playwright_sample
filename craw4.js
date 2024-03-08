const { firefox } = require("playwright");
const mongoose = require(`mongoose`);
const { isAddress } = require("ethers");
const connectString =
  "mongodb://127.0.0.1:27000,127.0.0.1:27001,127.0.0.1:27002/xpet-iflu&replicaSet=rs0";
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
    address: String,
    tw_username: String,
    tw_url: String,
    ref_key: String,
    created_at: String,
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

const axios = require("axios");
const callApi = async (url, method) => {
  try {
    let headers;

    const rs = await axios({
      method: method,
      url: url,
      timeout: 5000,
      headers,
    });

    return rs;
  } catch (error) {
    console.log("callApi", error);
    return null;
  }
};

async function read() {
  let isContinue = true;
  let total = 0;
  let page = 0;
  //xxx

  while (isContinue) {
    try {
      let link = `https://fi-api-v2.xpet.tech/getTopInfluencers?page=${page}`;
      console.log({ link });
      const rs = await callApi(link, "GET");
      const data = rs.data;
      const rows = data.data.topBoosters;

      for (const row of rows) {
        total++;
        const rank = total;

        // console.log({ rank, user, net_worth, tvf, followers });
        const tw_url = `https://twitter.com/` + row.user.tw_username;
        await userModel.create([
          {
            rank,
            tw_url,
            ...row.user,
          },
        ]);
        if (page >= 44) {
          isContinue = false;
        }
      }
      page++;
    } catch (error) {
      console.log(error);
    }
  }
  console.log("end");
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

  workbook.xlsx
    .writeFile("./users-influencers.csv")
    .then(() => console.log("File saved!"));
}

exportExcel();
