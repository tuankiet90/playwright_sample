const { firefox } = require("playwright");
const link = "https://dune.com/cryptokoryo/friendtech";

const mongoose = require(`mongoose`);
const connectString =
  "mongodb://127.0.0.1:27000,127.0.0.1:27001,127.0.0.1:27002/friendtech&replicaSet=rs0";
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
    rank_mean: { type: Number, index: true },
    rank_percentitle: String,
    rank_fee: String,
    rank_portfolio: String,
    subject_link: String,
    twitter_username: String,
    twitter_link: String,
    twitter_name: String,
    register_day: String,
    watch_list: String,
    holders: String,
    holding: String,
    price: String,
    portfolio: String,
    fee: String,
    r_profits: String,
    u_profits: String,
    deposited: String,
    withdraw: String,
    net_flow: String,
    spent_on_holdings: String,
    balance: String,
    win_rate: String,
    profitable_trades: String,
    close_positions: String,
    supply: String,
    shares_holding: String,
    self_hold: String,
    unrealized_profits: String,
    mcap: String,
    volume: String,
    fee_usd: String,
    fee_deposit_ratio: String,
    fee_portfolio_ratio: String,
    fee_cap_ratio: String,
    last_10_days_earning: String,
    deposits: String,
    withdraws: String,
    max_key_price: String,
    avg_key_price: String,
    discount: String,
    current_key_price: String,
    buys_subject: String,
    sells_subject: String,
    sell_buy_ratio: String,
    unique_traders: String,
    buys_traders: String,
    sells_traders: String,
    net_traders: String,
    buy_volume: String,
    sell_volume: String,
    key_traded: String,
    key_bought: String,
    key_sold: String,
    last_txn: String,
    tags: String,
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
  await waitMs(1000);
  for (let i = 0; i <= 4; i++) {
    await web.mouse.wheel(0, 550000);
  }
  await delay(20);
  const ul = await web.locator(".table_footer__pdKDO");
  const lis = await ul.locator("li").all();
  const nextButton = lis[5];

  let isContinue = true;
  let total = 0;
  let page = 1;
  while (isContinue) {
    console.log({ page, total });
    const rows = await web.locator("tr").all();
    console.log(`rows`, rows.length);
    for (let i = 0; i <= rows.length - 1; i++) {
      // for (let i = 0; i < cells.length; i++) {
      //   console.log(await cells[i].innerText());
      // }
      // const rank_mean = await cells[1].innerText();

      try {
        const cellsText = await rows[i].locator("td").allTextContents();

        if (cellsText.length == 0) {
          continue;
        }

        total++;
        const rank_mean = +cellsText[0];
        const rank_percentitle = cellsText[1];
        const rank_fee = cellsText[2];
        const rank_portfolio = cellsText[3];
        const subject_link = `https://www.friend.tech/` + cellsText[4];
        const twitter_username = cellsText[5];
        const twitter_link = `https://twitter.com/` + twitter_username;
        const twitter_name = cellsText[6];
        const register_day = cellsText[7];
        const watch_list = cellsText[8];
        const holders = cellsText[9];
        const holding = cellsText[10];
        const price = cellsText[11];
        const portfolio = cellsText[12];
        const fee = cellsText[13];
        const r_profits = cellsText[14];
        const u_profits = cellsText[15];
        const deposited = cellsText[16];
        const withdraw = cellsText[17];
        const net_flow = cellsText[18];
        const spent_on_holdings = cellsText[19];
        const balance = cellsText[20];
        const win_rate = cellsText[21];
        const profitable_trades = cellsText[22];
        const close_positions = cellsText[23];
        const supply = cellsText[24];
        const shares_holding = cellsText[25];
        const self_hold = cellsText[26];
        const unrealized_profits = cellsText[27];
        const mcap = cellsText[28];
        const volume = cellsText[29];
        const fee_usd = cellsText[30];
        const fee_deposit_ratio = cellsText[31];
        const fee_portfolio_ratio = cellsText[32];
        const fee_cap_ratio = cellsText[33];
        const last_10_days_earning = cellsText[34] || "-";
        const deposits = cellsText[35];
        const withdraws = cellsText[36];
        const max_key_price = cellsText[37];
        const avg_key_price = cellsText[38];
        const discount = cellsText[39];
        const current_key_price = cellsText[40];
        const buys_subject = cellsText[41];
        const sells_subject = cellsText[42];
        const sell_buy_ratio = cellsText[43];
        const unique_traders = cellsText[44];
        const buys_traders = cellsText[45];
        const sells_traders = cellsText[46];
        const net_traders = cellsText[47];
        const buy_volume = cellsText[48];
        const sell_volume = cellsText[49];
        const key_traded = cellsText[50];
        const key_bought = cellsText[51];
        const key_sold = cellsText[52];
        const last_txn = cellsText[53];
        const tags = cellsText[54];
        // console.log({
        //   rank_mean,
        //   rank_percentitle,
        //   rank_fee,
        //   rank_portfolio,
        //   subject_link,
        //   twitter_link,
        //   twitter_name,
        //   register_day,
        //   watch_list,
        //   holders,
        //   holding,
        //   price,
        //   portfolio,
        //   fee,
        //   r_profits,
        //   u_profits,
        //   deposited,
        //   withdraw,
        //   net_flow,
        //   spent_on_holdings,
        //   balance,
        //   win_rate,
        //   profitable_trades,
        //   close_positions,
        //   supply,
        //   shares_holding,
        //   self_hold,
        //   unrealized_profits,
        //   mcap,
        //   volume,
        //   fee_usd,
        //   fee_deposit_ratio,
        //   fee_portfolio_ratio,
        //   fee_cap_ratio,
        //   last_10_days_earning,
        //   deposits,
        //   withdraws,
        //   max_key_price,
        //   avg_key_price,
        //   discount,
        //   current_key_price,
        //   buys_subject,
        //   sells_subject,
        //   sell_buy_ratio,
        //   unique_traders,
        //   buys_traders,
        //   sells_traders,
        //   net_traders,
        //   buy_volume,
        //   sell_volume,
        //   key_traded,
        //   key_bought,
        //   key_sold,
        //   last_txn,
        //   tags,
        // });
        await userModel.create({
          rank_mean,
          rank_percentitle,
          rank_fee,
          rank_portfolio,
          subject_link,
          twitter_link,
          twitter_name,
          register_day,
          watch_list,
          holders,
          holding,
          price,
          portfolio,
          fee,
          r_profits,
          u_profits,
          deposited,
          withdraw,
          net_flow,
          spent_on_holdings,
          balance,
          win_rate,
          profitable_trades,
          close_positions,
          supply,
          shares_holding,
          self_hold,
          unrealized_profits,
          mcap,
          volume,
          fee_usd,
          fee_deposit_ratio,
          fee_portfolio_ratio,
          fee_cap_ratio,
          last_10_days_earning,
          deposits,
          withdraws,
          max_key_price,
          avg_key_price,
          discount,
          current_key_price,
          buys_subject,
          sells_subject,
          sell_buy_ratio,
          unique_traders,
          buys_traders,
          sells_traders,
          net_traders,
          buy_volume,
          sell_volume,
          key_traded,
          key_bought,
          key_sold,
          last_txn,
          tags,
        });
      } catch (error) {
        console.log("error", error);
        continue;
      }
      //save row
    }
    if (page >= 1518) {
      isContinue = false;
    }
    await nextButton.click();
    page++;
    await waitMs(2000);
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

async function json() {
  const users = await userModel.find();

  const data = { users };
  var fs = require("fs");
  fs.writeFileSync("users.json", JSON.stringify(data, null, 4));
}

json()