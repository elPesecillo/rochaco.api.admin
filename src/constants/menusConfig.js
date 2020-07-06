const userType = require("./userType").userTypes;

/**
 * Get menus list
 */
exports.menus =
    [
        {
            name: "Inicio",
            path: "/",
            icon: "icon icon-home2",
            visible: true,
            validUserTypes: [userType.guard, userType.admin, userType.guest, userType.neighbor],
            order: 1
        },
        {
            name: "Guardias",
            path: "/admin/guardias",
            icon: "icon icon-shield",
            visible: true,
            validUserTypes: [userType.guest, userType.guard, userType.admin],
            order: 2
        },
        {
            name: "GuardiasForm",
            icon: "icon icon-shield",
            path: "/admin/guardias-form",
            visible: false,
            validUserTypes: [userType.guest, userType.guard, userType.admin],
            order: 6
        },
        {
            name: "Vecinos",
            path: "/admin/vecinos",
            icon: "icon icon-users",
            visible: true,
            validUserTypes: [userType.guard, userType.admin],
            order: 3
        },
        {
            name: "Colonia",
            path: "/admin/colonias",
            icon: "icon icon-building",
            visible: true,
            validUserTypes: [userType.admin, userType.guest],
            order: 4
        },
        {
            name: "Colonia Status",
            path: "/admin/coloniaStatus",
            icon: "icon icon-building",
            visible: false,
            validUserTypes: [userType.admin, userType.guest],
            order: 4
        },
        {
            name: "Mi Cuenta",
            path: "/admin/cuenta",
            icon: "icon icon-account_circle",
            visible: true,
            validUserTypes: [userType.guard, userType.admin, userType.guest, userType.neighbor],
            order: 5
        }
    ];