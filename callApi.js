const axios=require("axios")
export const callApi = async (url, method) => {
  try {
    let headers;

    const rs = await axios({
      method: method,
      url: url,
      timeout: 5000,
      headers,
      data,
    });

    return rs;
  } catch (error) {
    //console.log(error);
    telegramService.default.relayMessageDev(`error : ${error.message} ${url}.`);
    return null;
  }
};
