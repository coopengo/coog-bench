module.exports = {
  port: 3000,
  files: ['dist/**'],
  serveStatic: ['dist'],
  proxy: {
    target: 'localhost:8000'
  }
};
