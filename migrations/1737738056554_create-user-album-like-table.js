/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    userId: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    albumId: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
      onDelete: 'CASCADE'
    }
  });


  pgm.addConstraint('user_album_likes', 'unique_userId_albumId', 'UNIQUE("userId", "albumId")');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
