module.exports = {
  plugins: [
    require('postcss-mixins'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('@lipemat/css-mqpacker'),
    require('cssnano')({
      preset: 'default'
    }),
  ]
};
