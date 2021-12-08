import resolve from '@rollup/plugin-node-resolve';


export default {
  input: ['./example/app.js'],

  output: 

    {
      file: './example/dist/gl3d.module.js',
      format: 'esm',
      sourcemap: true,
    }
  
  ,  
  plugins: [

  resolve({
    browser: true,
    preferBuiltins: false
}) 
]
  
};
