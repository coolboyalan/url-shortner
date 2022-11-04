const urlModel = require("../models/urlModel");
const validator = require("validator");
const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient(
  12180,
  "redis-12180.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("J9z2aQOHrDsXdSsYTtb3XMY2K8uLDYv2", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const shortURL = async (req, res) => {
  try {
    let url = req.body.longUrl;
    if (!("longUrl" in req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "longUrl is missing" });
    }
    if (typeof url != "string") {
      return res
        .status(400)
        .send({ status: false, message: "longUrl should must be a string" });
    }
    if (!url.trim().length) {
      return res
        .status(400)
        .send({ status: false, message: "longUrl can't be a empty string" });
    }
    if (!validator.isURL(url)) {
      return res
        .status(400)
        .send({ status: false, message: "longUrl is not a valid URL" });
    }

    if (url.match("https://")) {
      url = url.replace("https://", "http://");
    }

    if(!url.match("http://")){
      url = `http://${url}`
    }
    if (url.match("//www.")) url = url.replace("www.", "");

    let findUrl = await urlModel
      .findOne({ longUrl: url })
      .select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 });

    if (findUrl) {
      return res.status(200).send({ status: true, data: findUrl });
    }

    let urlCode = () => {
      return Math.random().toString(36).substring(2, 7);
    };

    let code = urlCode();

    let data = {
      urlCode: code,
      longUrl: url,
      shortUrl: `http://${req.get("host")}/${code}`,
    };

    await urlModel.create(data);

    return res.status(201).send({ status: true, data: data });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const getURL = async (req, res) => {
  try {
    let urlCode = req.params.urlCode;

    if (urlCode.length != 5) {
      return res
        .status(404)
        .send({ status: false, message: "urlCode is invalid" });
    }

    let cacheData = await GET_ASYNC(`${urlCode}`);
    if (cacheData) {
      return res.status(302).redirect(cacheData);
    }

    let data = await urlModel.findOne({ urlCode: urlCode });

    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "there is no url with this code" });
    }
    res.status(302).redirect(data.longUrl);
    await SET_ASYNC(`${urlCode}`, data.longUrl, "EX", 1440 * 60);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  shortURL,
  getURL,
};
