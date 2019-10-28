const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Administrador',
          email: 'admin@gobarber.com',
          password_hash: bcrypt.hashSync('123456', 8),
          createdAt: new Date(),
          updatedAt: new Date(),
          provider: false,
        },
      ],
      {}
    );
  },

  down: () => {},
};
