const router = require("express").Router();
const { route } = require(".");
const adminController = require("../controller/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router.get("/signin", adminController.viewSignIn);
router.post("/signin", adminController.actionSignIn);
router.use(auth);
router.get("/dashboard", adminController.viewDashboard);
router.get("/logout", adminController.actionLogOut);
//CATEGORY ROUTER
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.delete("/category/:id", adminController.deleteCategory);
router.put("/category", adminController.editCategory);

//Bank ROUTER
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.post("/bank", upload, adminController.editBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

//Items ROUTER
router.get("/items", adminController.viewItems);
router.post("/items", uploadMultiple, adminController.addItem);
router.get("/items/show-image/:id", adminController.showImageItem);
router.get("/items/:id", adminController.showEditItems);
router.put("/items/:id", uploadMultiple, adminController.editItem);
router.delete("/items/:id/delete", adminController.deleteItem);
router.get("/items/show-detail-item/:itemId", adminController.showDetailItem);
router.post("/items/add/feature", upload, adminController.addFeature);
router.put("/items/update/feature", upload, adminController.editFeature);
router.delete("/items/:itemId/feature/:id", adminController.deleteFeature);
router.post("/items/add/activity", upload, adminController.addActivity);
router.put("/items/update/activity", upload, adminController.editActivity);
router.delete("/items/:itemId/activity/:id", adminController.deleteActivity);

//BOOKING ROUTER
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirmation", adminController.actionConfirmation);
router.put("/booking/:id/reject", adminController.actionReject);

module.exports = router;
