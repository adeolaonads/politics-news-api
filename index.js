const port =  process.env.port || 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')


const app = express()

const newspapers = [
  {
    name: "the punch",
    address: "https://punchng.com/topics/politics/",
    base: "",
  },
  {
    name: "vanguard",
    address: "https://www.vanguardngr.com/category/politics/",
    base: "",
  },

  {
    name: "tribune",
    address: "https://tribuneonlineng.com/politics/",
    base: "",
  },

  {
    name: "guardian",
    address: "https://guardian.ng/category/politics/",
    base: "",
  },

  {
    name: "the sun",
    address: "https://www.sunnewsonline.com/category/politics/",
    base: "",
  },

  {
    name: "dailytrust",
    address: "https://dailytrust.com/topics/politics",
    base: "https://dailytrust.com",
  },

  {
    name: "saharareporters",
    address: "http://saharareporters.com/politics",
    base: "http://saharareporters.com/",
  },
  {
    name: "premiumtimes",
    address: "https://www.premiumtimesng.com/",
    base: "",
  },

  {
    name: "dailypost",
    address: "https://dailypost.ng/politics/",
    base: "",
  },
  {
    name: "pmnews",
    address: "https://pmnewsnigeria.com/category/news/politics/",
    base: ''
  },
];



const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then((response) => {
        const html = response.data
        // console.log('This is the response data retrieved', html)
        const $ = cheerio.load(html)

        $('a:contains("APC"), a:contains("PDP"), a:contains("FG"), a:contains("IPOB"), a:contains("Biafra"), a:contains("Boko Haram"), a:contains("Congress"), a:contains("Buhari"), a:contains("TInubu"), a:contains("Election")', html).each(function () {
            const title = $(this).text()
            // console.log('This is the title of the element', title )
            const url = $(this).attr('href')
            // console.log(title)
            const textdataOnly = title
            if(!textdataOnly.includes('img')){ // remove any img element returned in title
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            }
            })
        })
})

app.get('/', (req, res) => {
    res.json("Welcome to the nigerian politics news api page, Add /news to the end of this current URL to access the page")
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

   const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

   const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    console.log(newspaperAddress);

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        
         $('a:contains("APC"), a:contains("PDP"), a:contains("FG")', html).each(
           function () {
             const title = $(this).text();
             const url = $(this).attr("href");
             const textdataOnly = title;
             if (!textdataOnly.includes("img")) {
               specificArticles.push({
                 title,
                 url: newspaperBase + url,
                 source: newspaperId,
               });
             }
           }
         )
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})