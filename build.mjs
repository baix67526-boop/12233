import {cpSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const file of ['index.html','style.css','app.js','schools.js','favicon.svg']) cpSync(file,'dist/'+file);
