/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activity', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlistId: {
      type: 'VARCHAR(50)',
      onDelete: 'SET NULL',
      references: 'playlists(id)'
    },
    userId:{
      type: 'VARCHAR(50)',
      notNull: true
    },
    songId: {
      type: 'VARCHAR(50)',
      notNull: true

    },
    action: {
      type: 'TEXT',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMP WITHOUT TIME ZONE',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activity');
};
