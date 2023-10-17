import {OBJLoader} from "@loaders.gl/obj";
import { load } from "@loaders.gl/core";
import { initBuffer, gl } from "../main";
import { loadShader } from "./loadShader";
let vBuffer = null
let iBuffer = null
let count = 0;
let isVertices = false
let isIndices = false
export async function loadObj(filename){
    const obj = await load(filename, OBJLoader)
    const vertices = obj.attributes.POSITION.value;
    vBuffer = initBuffer(gl.ARRAY_BUFFER, vertices);
    if(iBuffer === null){
        isVertices = true
    }
    count = vertices.length
    return obj

}

export async function loadMtl(filename){
    const file = await loadShader(filename)

   const arr = file.split('\n').filter(line => !line.startsWith('#') && line.length > 0)

   console.log(arr)




   function createMaterials(){
       const materials = []
       let material = {}
    const keywords = {
        'newmtl': newMtl,
        'Ns': ns,
        'Ka': ka,
        'Kd': kd,
        "Ks": ks,
        'Ke': ke,
        'Ni': ni,
        'd': d,
        'illum': illum,
        'map_Kd': diffuseMap,
        // '': noop

    }
    function noop(){

    }
    function newMtl(v){
        material = {}
        material.name = v[0]
        materials.push(material)
        console.log('mat created')

    }
    function ns(v){
        material.ns = v.map(parseFloat)[0]
    }
    function ka(v){
        material.ka = v.map(parseFloat)
    }
    function kd(v){
        material.kd = v.map(parseFloat)

    }
    function ks(v){
        material.ks = v.map(parseFloat)

    }
    function ke(v){
        material.ke = v.map(parseFloat)

    }
    function ni(v){
        material.ni = parseFloat(v[0])

    }
    function d(v){
        material.d = parseFloat(v[0])

    }
    function illum(v){
        material.illum = parseInt(v[0])

    }
    function diffuseMap(v){
        material.diffuseMap = v[0]

    }

for (const line of arr) {
    // console.log('line', line)
    const kw = line.split(' ')[0]
    const values = line.split(' ').slice(1)
    // console.log('values', values)
    

    for(const key of Object.keys(keywords)){

        if(line.startsWith(key)){
            keywords[key](values)
        }
    }
}
 return materials
}

   const materials = createMaterials()


   

    return materials

}

export {vBuffer,count, isVertices, isIndices}