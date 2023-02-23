const moment = require('moment');
const mongoose = require('mongoose');
// const Base = require('./baseModel');

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Enter the menu name'
  },
  link: {
    type: String,
    required: 'Enter the menu link'
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  },
  position: {
    type: Number,
    default: 1
  },
  icon: {
    type: String
  },
  visible: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String
  },
  transtime: {
    type: Date,
    default: moment.utc()
  }
});

MenuSchema.statics = {
  getMenuById(menuId) { // , projectId){
    return this.findOne({
      _id: menuId // ,
      // project: projectId
    });
  },
  updateMenu(objMenu) {
    return this.update({
      _id: objMenu._id
    }, {
      $set: {
        name: objMenu.name,
        link: objMenu.link,
        parentId: objMenu.parentId,
        position: objMenu.position,
        icon: objMenu.position,
        visible: objMenu.visible,
        active: objMenu.active,
        type: objMenu.active,
        transtime: moment.utc()
      }
    });
  },
  deleteMenu(menuId) {
    return this.deleteMany({
      _id: menuId
    });
  },
  getChildMenus(menuId) {
    return this.find({
      parentId: menuId
    });
  },
  getChildMenusRecursively(parents) {
    const _this = this;
    const getThisLevelChilds = this.getChildMenus(parents);
    let elements = [];
    return new Promise((resolve, reject) => {
      getThisLevelChilds.then((childs) => {
        if (childs.length > 0) {
          elements = JSON.parse(JSON.stringify(childs)).map((child) => child._id);
          const getInnerChilds = _this.getChildMenusRecursively(elements);
          getInnerChilds.then((result) => {
            resolve(elements.concat(result));
          });
        } else resolve(elements);
      }, (err) => {
        reject(err);
      });
    });
  },
  getParentMenusRecursively(menuId) {
    const _this = this;
    const getThisLevel = this.getMenuById(menuId);
    const elements = [];
    return new Promise((resolve, reject) => {
      getThisLevel.then((levelMenu) => {
        const menu = JSON.parse(JSON.stringify(levelMenu));
        if (menu && menu.parentId) {
          elements.push(menu.parentId);
          const getMoreParents = _this.getParentMenusRecursively(menu.parentId);
          getMoreParents.then((result) =>
            resolve(elements.concat(result)));
        } else resolve(elements);
      }, (err) => reject(err));
    });
  },
  getMenus(menus) {
    return this.find({ _id: menus });
  }
};

const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;
