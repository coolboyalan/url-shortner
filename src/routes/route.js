import express from "express"
import urlController from "../controllers/urlController.js"
const router = express.Router()

// POST API TO CREATE A SHORT URL
router.post("/url/shorten",urlController.shortURL)

//GET API TO GT THE SHORT URL
router.get("/:urlCode",urlController.getURL)

//INVALID ROUTES WILL BE HANDLED HERE
router.all("*", function (req, res) {
    res.status(404).send({ status: false, message: "you're on a wrong route" });
  });

export default router