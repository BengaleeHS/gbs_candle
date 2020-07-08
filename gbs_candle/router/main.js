module.exports = function (app) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');
    var cheerio = require('cheerio');

    router.get('/', (req, res) => {
        if (req.session.logined) {
            res.render('candle');
        }
        else {
            res.render('gbslogin');
        }
        
    });
    router.post('/', (req, res) => {
        var userid = req.body.uid;
        var pswd = req.body.pwd;
        if (!(userid.length > 0 && pswd.length > 0)) {
            res.redirect('/');
        }
        else {
            const gbsoptions = {
                uri: 'http://www.gbs.hs.kr/logic/session_start.php',
                method: 'POST',
                form: {
                    user_id: userid,
                    user_pwd: pswd,
                }

            };
            request.post(gbsoptions, (err, httpres, body) => {
                if (err) {
                    throw err;
                }
                if (JSON.stringify(httpres.body).indexOf('alert') == -1) {
                    if (httpres.headers["set-cookie"].length > 0) {
                        const getoptions = {
                            uri: 'http://www.gbs.hs.kr/main/main.php?categoryid=01&menuid=05&groupid=00',
                            method: 'GET',
                            headers: {
                                'Cookie': httpres.headers["set-cookie"].toString()
                            }
                        };
                        request.get(getoptions, (err, httpres, body) => {
                            if (httpres.body.toString().indexOf('html') === -1) {
                                res.redirect('/')
                            }
                            const regban = /selected\>(.)\-(.)반\</
                            const regbeon = /selected\>(..)번\</
                            const regname = / 이 름<\/th>\r\n\t*<td>\r\n\t*([가-힣]{2,4})/
                            const hakban = regban.exec(httpres.body.toString());
                            const beon = regbeon.exec(httpres.body.toString());
                            const name = regname.exec(httpres.body.toString());
                            if (hakban != null && beon != null && name != null) {
                                var userdat = hakban[1] + hakban[2] + beon[1] + name[1];
                                req.session.userdat = userdat;
                                req.session.logined = true;

                                res.render('candle');
                            }
                        });
                    }
                    else {
                        res.redirect('/');
                    }
                }
                else {
                    res.redirect('/');
                }
            });
        }


    });
    router.get('/logout', (req, res) => {
        req.session.destroy((err) => { if (err) throw err;});
        res.redirect('/');
    });
    router.get('/meal', (req, res) => {
        if (req.query.date) {
            var data = [];
            const getoptions = {
                uri: 'http://www.gbs.hs.kr/main/main.php?categoryid=05&menuid=04&groupid=02&ymd=' + req.query.date,
                method: 'GET',
            };
            request.get(getoptions, (err, httpres, body) => {
                var dat = cheerio.load(body);
                dat("#admin_meal2").children("table").each((key, val) => {
                    var mealtext = dat(val).children("tbody").find("tr").first().find("td").text();
                    if (mealtext) {
                        data.push(mealtext);
                    }
                });
                if (data.length === 4) {
                    data = [data[1], data[2], data[3]];
                    res.status(200).json({ meal: data });
                }
                
            });
        }
    });
    return router;
}