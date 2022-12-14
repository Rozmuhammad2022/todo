import { hash, compare } from "bcrypt";
import User from "../models/signup.js";
import Count from "../models/add.js";
import moment from "moment";
import { extname, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { unlinkSync, renameSync, unlink, rename, writeFile } from "fs";
let Orginalname;
class Main {
    signInPage(req, res) {
        res.render("main/signin", { title: "Sign In" });
    }

    signUpPage(req, res) {
        res.render("main/signup", { title: "Sign Up" });
    }

    async listPage(req, res) {
        let data = await Count.find();
        res.render("main/list", { title: "List Drugs", data });
    }

    addPage(req, res) {
        res.render("main/add", { title: "Adding Drug" });
    }

    async drugPage(req, res) {
        let id = req.params.id;
        let drug = await Count.findById(id);
        if (drug) {
            return res.render("main/drug", { drug });
        }

        return res.json("Error 500");
    }

    async signUp(req, res) {

        let existUser = await User.find();

        if (existUser.length !== 0) {
            req.flash("errors", ["You do not sign up"]);
            return res.redirect("/");
        }

        req.body.password = await hash(req.body.password, 10);

        await User.create(req.body);
        res.redirect("/");
    }

    // sign in qilish
    async signIn(req, res) {
        const { name, password } = req.body;

        let user = await User.findOne({ name });

        if (!user) {
            req.flash("errors", ["User not find"]);
            return res.redirect("/");
        } else {
            let isMatch = await compare(password, user.password);

            if (isMatch) {
                req.session.user = user;
                return res.redirect("/list");
            } else {
                req.flash("errors", ["User not find"]);
                return res.redirect("/");
            }
        }
    }

    // Dori qo'shish
    async add(req, res) {
        Orginalname = req.file.originalname;
        console.log(Orginalname);
        const ext = extname(req.file.originalname).toLowerCase();
        if (!(ext === ".png" || ext === ".jpg")) {
            unlinkSync(resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.file.filename));
            req.flash("errors", ['Only .jpg and .png formats']);
            return res.redirect("/add");
        }

        req.body.img = req.file.filename + ext;

        renameSync(resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.file.filename),
            resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.file.filename + ext)
        );

        await Count.create(req.body);
        req.flash("success", "Drug added");
        res.redirect("/list");
    }

    async editCount(req, res) {
        const { id, name } = req.body;

        let drug = await Count.findById(id);
        let count = drug.count;

        if (name === "plus") {
            count++;
        } else if (name === "minus" && count > 0) {
            count--;
        }

        await Count.findByIdAndUpdate(id, { count: count });
        let updatedDrug = await Count.findById(id);
        let updatedMoment = moment(updatedDrug.updatedAt).add('days').calendar();

        res.json({ msg: 'success', count, updatedMoment });
    }

    async search(req, res) {
        let drug = req.body.searchedDrug;
        drug = drug.toLowerCase();
        let result = await Count.find({ name: drug });

        if (result.length !== 0) {
            res.render("main/searchResult", { title: "Results", data: result });
        } else {
            res.render("main/searchResult", { title: "Results", data: "Drug not find" });
        }
    }

    async deleteDrug(req, res) {
        let id = req.params.id;
        let drug = await Count.findById(id);
        await Count.findByIdAndRemove(id);
        console.log(drug.img);
        let filePath = (resolve(dirname(fileURLToPath(import.meta.url)), `../public/images/${drug.img}`));
        unlink(filePath, Myfunction);
        function Myfunction(err) {
            if (err) {
                console.log(`Err: Not Delete`);
            } else {
                console.log(`Sucsecc: Delete`)
            }
        }
        req.flash("success", `${drug.name} is deleted`);
        res.redirect("/list");
    }

    // Log out qilish
    logout(req, res) {
        delete req.session.user;
        res.redirect("/");
    }

    isAuth(req, res, next) {
        if (!req.session.user) {
            return res.redirect("/");
        } else {
            next();
        }
    }
    async editPage(req, res) {
        const id = req.params.id;
        const drugs = await Count.findById(id);
        res.render('main/edit', { title: "Edit Drug", drugs });

        //////////////////////////////////////////////////////////////
    }
    async edit(req, res) {
        const id = req.params.id;
        const drugs = req.body;
        const DruggS = await Count.findById(id);
        const ext = extname(req.file.originalname).toLowerCase();
        if (!(ext === ".png" || ext === ".jpg")) {
            unlinkSync(resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.file.filename));
            req.flash("errors", ['Only .jpg and .png formats']);
            return res.redirect("/add");
        }

        req.body.img = req.file.filename + ext;

        rename(resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.file.filename),
            resolve(dirname(fileURLToPath(import.meta.url)), "../public/images/" + req.body.img),
            function MyTest(err) {
                if (err) {
                    console.log(`Sucssec:!`);
                } else {
                    console.log('Error: (:');
                }
                let filePath = (resolve(dirname(fileURLToPath(import.meta.url)), `../public/images/${DruggS.img}`));
                unlink(filePath, Myfunction);
                function Myfunction(err) {
                    if (err) {
                        console.log(`Err: Not Delete`);
                    } else {
                        console.log(`Sucsecc: Delete`)
                    }
                }
            }
        );
        await Count.findByIdAndUpdate(id, drugs);
        res.redirect('/list');
    }

}

export default new Main();