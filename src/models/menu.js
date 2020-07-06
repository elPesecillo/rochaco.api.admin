const moment = require('moment');
const mongoose = require('mongoose');
//const Base = require('./baseModel');

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
    getMenuById: function (menuId) { //, projectId){
        return this.findOne({
            _id: menuId //, 
            //project: projectId
        });
    },
    updateMenu: function (objMenu) {
        return this.update({
            _id: objMenu._id
        }, {
                $set: {
                    'name': objMenu.name,
                    'link': objMenu.link,
                    'parentId': objMenu.parentId,
                    'position': objMenu.position,
                    'icon': objMenu.position,
                    'visible': objMenu.visible,
                    'active': objMenu.active,
                    'type': objMenu.active,
                    'transtime': moment.utc()
                }
            });
    },
    deleteMenu: function (menuId) {
        return this.deleteMany({
            _id: menuId
        });
    },
    getChildMenus: function (menuId) {
        return this.find({
            parentId: menuId
        });
    },
    getChildMenusRecursively: function (parents) {
        let _this = this;
        let getThisLevelChilds = this.getChildMenus(parents);
        let elements = [];
        return new Promise((resolve, reject) => {
            getThisLevelChilds.then((childs) => {
                if (childs.length > 0) {
                    elements = JSON.parse(JSON.stringify(childs)).map((child) => {
                        return child._id;
                    });
                    let getInnerChilds = _this.getChildMenusRecursively(elements);
                    getInnerChilds.then((result) => {
                        resolve(elements.concat(result));
                    });
                } else
                    resolve(elements);
            }, (err) => {
                reject(err);
            })
        });
    },
    getParentMenusRecursively: function (menuId) {
        let _this = this;
        let getThisLevel = this.getMenuById(menuId);
        let elements = [];
        return new Promise((resolve, reject) => {
            getThisLevel.then((menu) => {
                menu = JSON.parse(JSON.stringify(menu))
                if (menu && menu.parentId) {
                    elements.push(menu.parentId);
                    let getMoreParents = _this.getParentMenusRecursively(menu.parentId);
                    getMoreParents.then((result) =>
                        resolve(elements.concat(result)));
                } else
                    resolve(elements);
            }, err => reject(err));
        });
    },
    getMenus: function (menus) {
        return this.find({ _id: menus });
    }
}




const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;