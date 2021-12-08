 attribute vec3 vertexPos;
    uniform mat4 camMatrix;
    uniform mat4 pMatrix;
    uniform mat4 mMatrix;

    void main(void){
        
        gl_Position = pMatrix * camMatrix * mMatrix * vec4(vertexPos, 1.0); 
    }