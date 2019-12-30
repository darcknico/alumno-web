// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://127.0.0.1:8000/api/',
  apiUrl: 'http://alumno-rest.proyectosinformaticos.com.ar/api/',
  //apiUrl: 'http://ariasdesaavedra.edu.ar/sistema/alumno-rest/public/api/',
  //apiUrl: 'http://34.226.235.220/alumno-rest/public/index.php/api/',
  key_token:'key_alumno_token_auth',
};
