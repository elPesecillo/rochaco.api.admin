const mongoose = require('mongoose');

const PostalCodeSchema = new mongoose.Schema({
    d_codigo: {
        type: String
    },
    d_asenta: {
        type: String
    },
    d_tipo_asenta: {
        type: String
    },
    D_mnpio: {
        type: String
    },
    d_estado: {
        type: String
    },
    d_ciudad: {
        type: String
    },
    d_CP: {
        type: String
    },
    c_estado: {
        type: String
    },
    c_oficina: {
        type: String
    },
    c_CP: {
        type: String
    },
    c_tipo_asenta: {
        type: String
    },
    c_mnpio: {
        type: String
    },
    id_asenta_cpcons: {
        type: String
    },
    d_zona: {
        type: String
    },
    c_cve_ciudad: {
        type: String
    }
});

PostalCodeSchema.statics = {
    getCPInfo: function (cp) {
        let regCp = new RegExp(cp)
        return this.find({ d_codigo: regCp }).limit(100);
    }
};

const PostalCode = mongoose.model("PostalCode", PostalCodeSchema);

module.exports = PostalCode;