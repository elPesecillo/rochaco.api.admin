exports.userTypes = {
  guest: "guest",
  admin: "admin",
  suburbAdmin: "suburbAdmin",
  guard: "guard",
  neighbor: "neighbor",
};

exports.suburbStatus = [
  {
    status: "pending",
    description:
      "Tu solicitud para registrar la colonia ha sido enviada, por favor espera de 2 a 3 dias habiles o contactanos por medio de nuestras redes sociales para mayor informacion.",
  },
  {
    status: "rejected",
    description: "Lo sentimos tu solicitud fue rechazada.",
  },
  {
    status: "approved",
    description: "Tu solicitud a sido aprobada.",
  },
  {
    status: "feedback",
    description: "Tu solicitud a sido revisada, se requiere mas información.",
  },
];
