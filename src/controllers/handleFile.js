const userServices = require("../logic/userService");
const suburbService = require("../logic/suburbService");
//const fetchDbx = require('isomorphic-fetch');
const fs = require("fs");
// const Dropbox = require("dropbox").Dropbox;
const dropboxV2Api = require('dropbox-v2-api');
const sgMail = require('@sendgrid/mail');

const getFileName = (nodeFileName, originalName) => {
    let idx = originalName.lastIndexOf('.');
    return `${nodeFileName}.${originalName.substring(idx + 1)}`;
}

const uploadFileDropbox = (file) => {
    const dropbox = dropboxV2Api.authenticate({
        token: process.env.DROPBOX_TOKEN
    });

    return new Promise((resolve, reject) => {
        dropbox({
            resource: 'files/upload',
            parameters: {
                path: `/neighby/${getFileName(file.filename, file.originalname)}`
            },
            readStream: fs.createReadStream(`${file.destination}/${file.filename}`)
        }, (err, result, response) => {
            if (!err)
                resolve(result);
            else
                reject(err);
        });
    });
}

const base64_encode = (file_path) => {
    // read binary data
    var bitmap = fs.readFileSync(file_path);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap, 'base64').toString('base64');//.toString('base64');
}

const getEmailAttachments = (files) => {
    let attachments = [];
    files.forEach(file => {
        attachments.push({
            filename: `${file.originalname}`,
            content: base64_encode(`${file.destination}/${file.filename}`)
        });
    });
    return attachments;
};

const sendEmail = async (files, user, suburb) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: process.env.OWNER_EMAILS.split(','),
            from: 'support@neighby.com',
            subject: 'Nuevo requerimiento de registro de colonia.',
            text: `solicitud de registro.`,
            html: `<strong>El usuario ${user} desea registrar la colonia ${suburb} y envia estos documentos para revisión.</strong>`,
            attachments: getEmailAttachments(files)
        };
        await sgMail.send(msg);
    }
    catch (ex) {
        throw ex;
    }
}

const deleteTemporaryFiles = (files) => {
    files.forEach(file => {
        fs.unlink(`${file.destination}/${file.filename}`, (err) => {
            if (err) throw err;
            console.log(`path file ${file.destination}/${file.filename} has been deleted.`);
        });
    });
};

const processFileUpload = async (files, data) => {
    try {
        let { userId, name, lastName, cellphone, email, postalCode, section, suburbName, recaptchaToken } = data;
        let validCaptcha = await userServices.validateRecaptcha(recaptchaToken);
        let proms = [];
        files.forEach(file => {
            proms.push(uploadFileDropbox(file));
        });
        let uploadedFiles = await Promise.all(proms);

        await sendEmail(files, `${name} ${lastName}`, suburbName)

        let updateUser = await userServices.updateUser({ _id: userId, name, lastName, cellphone, email, active: true });

        let saveSuburb = await suburbService.saveSuburb({
            name: suburbName,
            location: section,
            postalCode: postalCode,
            active: true,
            userAdmins: [userId],
            status: [{
                status: 'activacionPendiente',
                description: 'Tu solicitud para registrar la colonia ha sido enviada, por favor espera de 2 a 3 dias habiles o contactanos por medio de nuestras redes sociales para mayor informacion.'
            }],
            files: files.map(fil=>({
                fileName: fil.filename,
                originalName: fil.originalname,
                actionType: "solicitudRegistro",
                mimetype: fil.mimetype
            }))
        })
        deleteTemporaryFiles(files);
        return saveSuburb;
    }
    catch (ex) {
        throw ex;
    }
};


exports.uploadFile = async (req, res, next) => {
    try {
        let { userId, name, lastName, cellphone, email, postalCode, section, suburbName, recaptchaToken } = req.body;
        let processFiles = await processFileUpload(req.files, {
            userId,
            name,
            lastName,
            cellphone,
            email,
            postalCode,
            section,
            suburbName,
            recaptchaToken
        });
        res.status(202).json({ message: 'ok' });
    } catch (ex) {
        res.status(400).json({ message: ex.message || 'No se pudo completar el registro.' });
    }
}