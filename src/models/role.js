const moment = require("moment");
const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Enter the name of the role",
  },
  description: {
    type: String,
    required: "Enter the description of the role",
  },
  siteAdministration: {
    type: Boolean,
    default: false,
  },
  sysAdministrator: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
  transtime: {
    type: Date,
    default: moment.utc(),
  },
});

RoleSchema.statics = {
  deleteRole(roleId) {
    return this.deleteMany({
      _id: roleId,
    });
  },
  setRoleMenu(roleId, newMenus) {
    let menus = newMenus;
    if (!Array.isArray(menus)) menus = [menus];
    return this.update(
      {
        _id: roleId,
      },
      {
        $addToSet: {
          menus: {
            $each: menus,
          },
        },
      },
      {
        multi: true,
      }
    );
  },
  deleteRoleMenu(selectedRoles, selectedMenus) {
    let menus = selectedMenus;
    let roles = selectedRoles;
    if (!Array.isArray(menus)) menus = [menus];
    if (!Array.isArray(roles)) roles = [roles];

    return this.update(
      {
        _id: {
          $in: roles,
        },
      },
      {
        $pullAll: {
          menus,
        },
      },
      {
        multi: true,
      }
    );
  },
  getRoleMenus(roleId) {
    return new Promise((resolve, reject) => {
      this.find({
        _id: roleId,
      })
        .populate("menus")
        .exec((err, result) => {
          if (err) reject(err);
          resolve(result);
        });
    });
  },
};

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
