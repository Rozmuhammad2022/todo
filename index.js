import express from "express";
import layout from "express-ejs-layouts";
import session from "express-session";
import validator from "express-validator";
import { connect } from "mongoose";
import flash from "express-flash";
import moment from "moment";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";

import router from "./routers/main.router.js";

connect("mongodb://localhost/farma", { useNewUrlParser:true, useUnifiedTopology:true });

let app = express();

app.set("view engine", "ejs");
app.set("port", 4000);

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(layout);
app.use(validator());
app.use(multer({dest: 'public/images'}).single('img'));  // single('files'))
app.use(session({
    secret: "213sf345fgg234fgwsdgt324",
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    saveUninitialized:false,
    resave:false
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || "";
    res.locals.message = req.flash();
    res.locals.moment = moment;
    next();
});

app.use(router);

app.listen(app.get('port'), () => {
    console.info(`Server is running on PORT: ${app.get('port')}`);
});