/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Usman Ali Student ID: 105451223 Date:09-04-2024 
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.get("/lego/addSet", async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { themes });
    } catch (err) {
        res.render("500", { message: "I'm sorry, but we have encountered the following error: " + err.toString() });
    }
});

app.post("/lego/addSet", async (req, res) => {
    try {
        await legoData.addSet(req.body);
        res.redirect("/lego/sets");
    } catch (err) {
        res.render("500", { message: "I'm sorry, but we have encountered the following error: " + err.toString() });
    }
});

app.get("/lego/editSet/:num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.num);
        const themes = await legoData.getAllThemes();
        res.render("editSet", { set, themes });
    } catch (err) {
        res.render("404", { message: "Set not found." });
    }
});

app.post("/lego/editSet/:num", async (req, res) => {  
    try {
        await legoData.editSet(req.params.num, req.body); 
        res.redirect("/lego/sets");
    } catch (err) {
        res.render("500", { message: "Error updating set: " + err.toString() });
    }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
    try {
        await legoData.deleteSet(req.params.num);
        res.redirect("/lego/sets");
    } catch (err) {
        res.render("500", { message: "I'm sorry, but we have encountered the following error: " + err.toString() });
    }
});

app.get("/lego/sets", async (req, res) => {
    try {
        const sets = req.query.theme ? await legoData.getSetsByTheme(req.query.theme) : await legoData.getAllSets();
        res.render("sets", { sets });
    } catch (err) {
        res.render("500", { message: "I'm sorry, but we have encountered the following error: " + err.toString() });
    }
});

app.get("/lego/sets/:num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.num);
        res.render("set", { set });
    } catch (err) {
        res.render("404", { message: "Set not found." });
    }
});

app.use((req, res) => {
    res.status(404).render("404", { message: "Page not found." });
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize data module:", err);
});

