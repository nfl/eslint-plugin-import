var fs = require('fs')
  , path = require('path')
  , resolve = require('resolve')

const CASE_INSENSITIVE = fs.existsSync(path.join(__dirname, 'reSOLVE.js'))

// http://stackoverflow.com/a/27382838
function fileExistsWithCaseSync(filepath) {
  // shortcut exit
  if (!fs.existsSync(filepath)) return false

  var dir = path.dirname(filepath)
  if (dir === '/' || dir === '.' || /^[A-Z]:\\$/.test(dir)) return true
  var filenames = fs.readdirSync(dir)
  if (filenames.indexOf(path.basename(filepath)) === -1) {
      return false
  }
  return fileExistsWithCaseSync(dir)
}

function fileExists(filepath) {
  if (CASE_INSENSITIVE) {
    return fileExistsWithCaseSync(filepath)
  } else {
    return fs.existsSync(filepath)
  }
}

function opts(basedir, settings) {
  // pulls all items from 'import/resolve'
  return Object.assign( { }
                      , settings['import/resolve']
                      , { basedir: basedir }
                      )
}

/**
 * wrapper around resolve
 * @param  {string} p - module path
 * @param  {object} context - ESLint context
 * @return {string} - the full module filesystem path
 */
module.exports = function (p, context) {
  // resolve just returns the core module id, which won't appear to exist
  if (resolve.isCore(p)) return p
  var file;

  var options = opts( path.dirname(context.getFilename())
                                   , context.settings);

  if (options && options.jspm === true) {
    try {
      var findRoot = require('find-root');
      var root = findRoot(process.cwd());

      var pkg = require(path.join(root, 'package.json'));

      if (pkg && pkg.jspm) {
        var jspmModule = p.split('/')[0];
        var target;

        if (pkg.jspm.dependencies && pkg.jspm.dependencies[jspmModule]) {
          target = pkg.jspm.dependencies[jspmModule];
        }

        if (pkg.jspm.dependencies && pkg.jspm.devDependencies[jspmModule]) {
          target = pkg.jspm.devDependencies[jspmModule];
        }

        if (target) {
          var targetPath = target.replace(':', '/');

          if (targetPath) {
            try {
              file = resolve.sync(targetPath, options)
              if (!fileExists(file)) return null
              return file
            } catch (err) {
              if (err.message.indexOf('Cannot find module') === 0) {
                return null
              }

              throw err
            }
          }
        }
      }
    } catch (err) {}
  }

  try {
    file = resolve.sync(p, options)
    if (!fileExists(file)) return null
    return file
  } catch (err) {
    if (err.message.indexOf('Cannot find module') === 0) {
      return null
    }

    throw err
  }
}

module.exports.relative = function (p, r, settings) {
  try {

    var file = resolve.sync(p, opts(path.dirname(r), settings))
    if (!fileExists(file)) return null
    return file

  } catch (err) {

    if (err.message.indexOf('Cannot find module') === 0) return null

    throw err // else

  }
}
