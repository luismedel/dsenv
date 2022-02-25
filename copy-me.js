// Copy this code anywhere in your project. That's it.

function loadEnv (opts)
{
  const expand = (env, value) => value.trim ()
                                      .replace (/^"([^"]*)"$/, "$1")
                                      .replace (/\$[a-zA-Z_][a-zA-Z0-9_]*/g, m => expand (env, env[m.substr (1)]));

  return fs.readFileSync (opts?.path || ".env", opts?.fs || { encoding:"utf8", flag:"r" })
           .split (/\n|\r/)
           .map (s => /^([^=]+)\=(.+)$/.exec (s))
           .reduce ((env,m) => { m && (env[m[1].trim ()] = expand (env, m[2])); return env; }, opts?.env || process.env);
}
