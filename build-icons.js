// Skleja pobrane ikony (img/icons/*.svg – Lucide, img/brand/*.svg – Font Awesome) w jeden sprite img/icons.svg
// Użycie na stronie: <svg class="ic"><use href="img/icons.svg#i-download"/></svg>   (brand: #b-windows)
const fs = require("fs");
const path = require("path");
const root = __dirname;
const out = [];
function add(dir, prefix) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".svg")).sort()) {
    let svg = fs.readFileSync(path.join(dir, f), "utf8").replace(/<\?xml[^>]*>|<!--[\s\S]*?-->/g, "");
    const vb = (svg.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
    const id = prefix + f.replace(/\.svg$/, "");
    // Lucide: stroke=currentColor już w atrybutach path? Nie – w <svg>. Przenosimy je na symbol.
    const isLucide = prefix === "i-";
    out.push(`<symbol id="${id}" viewBox="${vb}"${isLucide ? ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : ' fill="currentColor"'}>${inner}</symbol>`);
  }
}
add(path.join(root, "img", "icons"), "i-");
add(path.join(root, "img", "brand"), "b-");
fs.writeFileSync(path.join(root, "img", "icons.svg"), `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${out.join("\n")}</svg>\n`);
console.log("sprite:", out.length, "ikon ->", path.join(root, "img", "icons.svg"));
