# dsenv

Dead Simple, no dependency needed, .env support for Node in a **single function**.

Seriously, you don't need **another** dependency for that. Don't overcomplicate your project.

## How?

Say you have the following .env file:

```ini
; this is a comment
# this is a comment too
and this! (because is not in the form KEY = VALUE)

NAME = "Awesome project"
ROOT = /var/www/html
PATH = $ROOT/awesome
```

Copy this code anywhere in your project. **That's it**.

```js
function loadEnv (opts)
{
  const expand = (env, value) => value.trim ()
                                      .replace (/^"([^"]*)"$/, "$1")
                                      .replace (/\$[a-zA-Z_][a-zA-Z0-9_]*/g, m => expand (env, env[m.substr (1)]));

  return fs.readFileSync (opts?.path || ".env", opts?.fs || { encoding:"utf8", flag:"r" })
           .split (/\n|\r/)
           .map (s => /^([^=\s]+)\s*\=(.+)$/.exec (s))
           .reduce ((env,m) => { m && (env[m[1].trim ()] = expand (env, m[2])); return env; }, opts?.env || process.env);
}
```

Now call loadEnv ()...

```js
loadEnv ();
```

...and you'll get this in ```process.env```:

```sh
{
  NODE_VERSION: '17.6.0',
  YARN_VERSION: '1.22.17',
  SHLVL: '1',
  HOME: '/root',
  PWD: '/app',
  NAME: 'Awesome project',
  ROOT: '/var/www/html'
  PATH: '/var/www/html/awesome',
}
```

## Extra options

Use the following options to customize the load:

- ```path```: .env file to load.
- ```fs```:   Options for fs.readFileSync (defaults are { encoding:"utf8", flag:"r" })
- ```env```:  Object to append values to. Defaults to process.env, but you can specify any other.

For example, reusing the .env above:

```js
let myenv = loadEnv ({ path: ".env", fs: { encoding:"utf8", flag:"r" }, env:{}});
```

```myenv``` will contain:

```sh
{
  NAME: 'Awesome project',
  ROOT: '/var/www/html'
  PATH: '/var/www/html/awesome',
}
```

## Overriding values

You can load more than one .env file in order to mix values (not recommended) or override some values in testing environments:

```js
loadEnv ();                         // Loads default .env
loadEnv ({ path: ".env.debug" });   // Override with .env.debug
```

```process.env``` will contain all .env and updated .env.debug keys.
