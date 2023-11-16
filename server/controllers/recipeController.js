require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const global = await Recipe.find({ category: "Global" }).limit(limitNumber);
    const sweet = await Recipe.find({ category: "Sweet" }).limit(limitNumber);
    const fresh = await Recipe.find({ category: "Fresh" }).limit(limitNumber);
    const spicy = await Recipe.find({ category: "Spicy" }).limit(limitNumber);
    const sweetsour = await Recipe.find({ category: "Sweet-Sour" }).limit(
      limitNumber
    );
    const cocktail = { latest, global, sweet, fresh, spicy, sweetsour };

    res.render("index", {
      title: "Mixology Blog - Home",
      categories,
      cocktail,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.about = (req, res) => {
  try {
    res.render("about", {
      title: "Mixology Blog - Hakkında",
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.contact = (req, res) => {
  try {
    res.render("contact", {
      title: "Mixology Blog - İletişim",
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {
      title: "Mixology Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Mixology Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", {
      title: "Mixology Blog - Recipes",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Mixology Blog - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Mixology Blog - Explore Latest Cocktails",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Mixology Blog - Explore Random Cocktail",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");

  res.render("submit-recipe", {
    title: "Mixology Blog - Submit Cocktail Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been Added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

/*
async function insertDymyCategoryData() {
  try {
    await Category.insertMany([
      {
        name: "Global Cocktails",
        image: "global.jpg",
      },

      {
        name: "Sweet Cocktails",
        image: "sweet-cocktail.jpg",
      },
      {
        name: "Sweet-Sour Cocktails",
        image: "sweet-sour.jpg",
      },
      {
        name: "Fresh Cocktails",
        image: "fresh.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

insertDymyCategoryData();

*/
