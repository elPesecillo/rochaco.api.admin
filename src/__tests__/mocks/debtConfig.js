exports.DefaultConfigMock = {
  primary: true,
  name: "Cuota de mantenimiento",
  amount: 200,
  type: "automatic",
  chargeEvery: "month",
  chargeOnDay: 1,
  chargeExpiresOnDay: 5,
  limitUserPermissionsOnExpiration: true,
  expirationDate: new Date("2036-01-01"),
  generateUpTo: 12,
  assignAllAddresses: true,
};

exports.AdditionalConfigMock = {
  primary: false,
  name: "Cuota de tarjeta extra",
  amount: 100,
  type: "automatic",
  chargeEvery: "month",
  chargeOnDay: 1,
  chargeExpiresOnDay: 8,
  limitUserPermissionsOnExpiration: true,
  expirationDate: new Date("2036-01-01"),
  generateUpTo: 12,
  assignAllAddresses: false,
};
