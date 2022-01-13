const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");
const { INSPECT_MAX_BYTES } = require("buffer");
const { error } = require("console");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Member = require("../models/Member");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const Booking = require("../models/Booking");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          title: "Staycation | Login Page",
          alert,
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Staycation | Category",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {}
  },

  actionSignIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", `Username tidak ditemukan`);
        req.flash("statusMessage", "danger");
        res.redirect("/admin/signin");
      }
      const ifPasswordMatch = await bcrypt.compare(password, user.password);
      if (!ifPasswordMatch) {
        req.flash("alertMessage", `Password yang anda masukkan salah`);
        req.flash("statusMessage", "danger");
        res.redirect("/admin/signin");
      }

      (req.session.user = {
        id: user.id,
        username: user.username,
      }),
        res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionLogOut: (req, res) => {
    req.session.destroy();
    res.redirect("admin/signin");
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      // console.log(category);
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      res.render("admin/category/view-category", {
        category,
        alert,
        title: "Staycation | Category",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      req.flash("alertMessage", "Sukses menambahkan Data");
      req.flash("statusMessage", "success");
      await Category.create({ name });
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      req.flash("alertMessage", "Sukses Mengubah Data");
      req.flash("statusMessage", "success");
      const category = await Category.findOne({ _id: id });
      category.name = name;
      category.save();
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(" /admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      category.remove();
      req.flash("alertMessage", "Sukses Menghapus Data");
      req.flash("statusMessage", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/category");
    }
  },
  //BANKKKKKKKKKKKKKKKKKKKK
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      res.render("admin/bank/view_bank.ejs", {
        title: "Staycation | Bank",
        alert,
        bank,
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { name, bankName, accountNumber } = req.body;
      await Bank.create({
        name,
        bankName,
        accountNumber,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Sukses Menambah Bank");
      req.flash("statusMessage", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, name, bankName, accountNumber } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file === undefined) {
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        await bank.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Sukses Menghapus Data");
      req.flash("statusMessage", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItems: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({ path: `imageId`, select: `id imageUrl` })
        .populate({ path: `categoryId`, select: `id name` });
      // console.log(item);
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      const category = await Category.find();
      res.render("admin/items/view_items.ejs", {
        title: "Staycation | Items",
        category,
        alert,
        item,
        action: "view",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
    }
  },
  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, about, city } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description: about,
          price,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash("alertMessage", "Sukses Menambah  Data");
        req.flash("statusMessage", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMessage", `${error}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
      // console.log(`${error.message}`);
    }
  },
  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: `imageId`,
        select: `id imageUrl`,
      });
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      res.render("admin/items/view_items.ejs", {
        title: "Staycation | Show Image Item",
        alert,
        item,
        action: "show image",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
    }
  },
  showEditItems: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const item = await Item.findOne({ _id: id })
        .populate({
          path: `imageId`,
          select: `id imageUrl`,
        })
        .populate({
          path: `categoryId`,
          select: `id name`,
        });
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      res.render("admin/items/view_items.ejs", {
        title: "Staycation | Show Edit Item",
        alert,
        item,
        category,
        action: "edit",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, about, city } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: `imageId`,
          select: `id imageUrl`,
        })
        .populate({
          path: `categoryId`,
          select: `id name`,
        });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        (item.title = title),
          (item.price = price),
          (item.city = city),
          (item.description = about),
          (item.categoryId = categoryId);
        await item.save();
        req.flash("alertMessage", "Sukses Mengupdate  Data");
        req.flash("statusMessage", "success");
        res.redirect("/admin/items");
      } else {
        (item.title = title),
          (item.price = price),
          (item.city = city),
          (item.description = about),
          (item.categoryId = categoryId);
        await item.save();
        req.flash("alertMessage", "Sukses Mengupdate  Data");
        req.flash("statusMessage", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMessage", `${error}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate(`imageId`);
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error}`);
            req.flash("statusMessage", "danger");
            res.redirect("/admin/items");
          });
      }
      await item.remove();
      req.flash("alertMessage", "Sukses Delete  Data");
      req.flash("statusMessage", "success");
      res.redirect("/admin/items");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect("/admin/items");
    }
  },
  showDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });
      const alert = { message: alertMessage, status: statusMessage };
      res.render("admin/items/detail_item/view_detail_item.ejs", {
        title: "Staycation | Detail Item",
        alert,
        itemId,
        feature,
        activity,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Image not Found");
        req.flash("statusMessage", "danger");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash("alertMessage", "Sukses Menambah  Feature");
      req.flash("statusMessage", "success");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    } catch (error) {
      // console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file === undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("featureId");
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash("alertMessage", "Sukses Delete Data");
      req.flash("statusMessage", "success");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "Image not Found");
        req.flash("statusMessage", "danger");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });
      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      req.flash("alertMessage", "Sukses Menambah  Activity");
      req.flash("statusMessage", "success");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    } catch (error) {
      // console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file === undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
        req.flash("alertMessage", "Sukses Mengubah Data");
        req.flash("statusMessage", "success");
        res.redirect(`/admin/items/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Sukses Delete Data");
      req.flash("statusMessage", "success");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/items/show-detail-item/${itemId}`);
    }
  },
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
      console.log(booking);
      res.render("admin/booking/view_booking.ejs", {
        title: "Staycation | Booking",
        user: req.session.user,
        booking,
      });
    } catch (error) {
      res.redirect(`/admin/booking`);
    }
  },
  showDetailBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const statusMessage = req.flash("statusMessage");
      const alert = { message: alertMessage, status: statusMessage };
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");
      res.render("admin/booking/show_detail_booking.ejs", {
        title: "Staycation | Detail Booking",
        user: req.session.user,
        booking,
        alert,
      });
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },

  actionConfirmation: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Accept";
      await booking.save();
      req.flash("alertMessage", "Sukses Konfirmasi Pembayaran");
      req.flash("statusMessage", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Reject";
      await booking.save();
      req.flash("alertMessage", "Sukses Reject Pembayaran");
      req.flash("statusMessage", "danger");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
