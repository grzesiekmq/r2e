export async function loadShader(filename) {
    const res = await fetch(filename);
    const file =
        await res.text();
    return file;
}