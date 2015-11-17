babel-plugin-metal-register-components
===================================

A babel plugin for Metal.js that automatically registers components.

## Usage

This is a [babel plugin](http://babeljs.io/docs/plugins/) automatically registers Component classes. Helps avoid the boilerplate of doing it manually for each component. To use it, just add it to your package.json and pass it as a plugin when calling babel:

```javascript
{
  "plugins": ["metal-register-components"]
}
```

Note that [gulp-metal](https://github.com/metal/gulp-metal) already includes this plugin by default on build tasks. So there's no need to add it manually if you're using it.
