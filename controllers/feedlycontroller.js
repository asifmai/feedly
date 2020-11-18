const { URLSearchParams } = require("url");
const fetch = require('node-fetch');
const axios = require('axios');
const User = require('../models/User');
const redirectUri = 'https://feedlyauth.herokuapp.com/feedlyCallback'

module.exports.callback_get = async (req, res) => {
  const code = req.query.code;
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append(
    "redirect_uri",
    redirectUri
  );
  params.append("client_id", "sandbox");
  params.append("client_secret", "HFoDWzLMxtSMFM3FJNgT4gdBIacC3Gm2");

  var resdata = await fetch("https://sandbox7.feedly.com/v3/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  }).then(async function (res) {
    var test = await res.json();
    return test;
  })
  .catch(function (err) {
    console.err(err);
  });

  let user = await User.findOne({userId: resdata.id});
  if (!user) {
    console.log('User not found, creating now...');
    const newUser = new User({userId: resdata.id});
    user = await newUser.save();
  }

  console.log(resdata);
  
  return res.render('feedly', {
    accessToken: resdata.access_token,
    refreshToken: resdata.refresh_token,
    user_id: resdata.id,
  })
}

module.exports.searchfeedly_post = async (req, res) => {
  let result = await axios
    .get(`https://sandbox7.feedly.com/v3/search/contents?query=${req.body.query}`, {
      headers: {
        Authorization: `OAuth ${req.body.token}`,
      },
    })
    .then((res) => res.data.items)
    .catch((err) => {
      console.log(err.response);
    });

  console.log(result.length);
  result = result.map((article) => {
    if (!article) return;
    let image = article.thumbnail
      ? article.thumbnail.length > 0
        ? article.thumbnail[0].url
        : ""
      : "";
    if (!image)
      image = article.enclosure
        ? article.enclosure.length > 0
          ? article.enclosure[0].href
          : ""
        : "";

    if (!image) image = article.visual ? article.visual.url : "";
    var obj = {
      title: article.title,
      image:
        image && image.includes("https")
          ? image
          : image.replace("http", "https"),
      description: article.content
        ? stripHtml(article.content.content)
        : article.summary
        ? stripHtml(article.summary.content)
        : "no description",
      link: article.alternate
        ? article.alternate.length > 0
          ? article.alternate[0].href
          : ""
        : article.canonical
        ? article.canonical.length > 0
          ? article.canonical[0].href
          : ""
        : "",
      category: article.categories
        ? article.categories.length > 0
          ? article.categories[0].label
          : ""
        : "",
      track_id: article.id,
      id: article.id,
      author: article.author,
      source: article.origin ? article.origin.title : "",
      sourceUrl: article.origin ? article.origin.htmlUrl : "",
      published: article.published,
      type: "news",
    };

    return obj;
  });

  console.log(result);
  res.status(200).json(result);
}