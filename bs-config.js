module.exports = {
  port: 3001,
  files: ['dist/**'],
  serveStatic: ['dist'],
  proxy: {
    target: 'localhost:7993'
  }
};
