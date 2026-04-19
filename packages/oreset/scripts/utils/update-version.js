import fs from "fs";
import packageJson from "../../package.json" with { type: "json" };

export function updateVersion(filePath) {
  if (packageJson.version.includes("-bate")) return;

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err}`);
        return reject(err);
      }

      const escapedName = packageJson.name.replace(/\//g, "\\/");
      // CDN URL のバージョン更新（README 等）
      const urlRegex = new RegExp(`/${escapedName}@([^/]+)/`, "g");
      // ソース CSS のバナーコメントのバージョン更新
      const bannerRegex = /Oreset\.css v[\d.]+(?:-[\w.]+)?/g;

      let updated = data.replace(urlRegex, `/${packageJson.name}@${packageJson.version}/`);
      updated = updated.replace(bannerRegex, `Oreset.css v${packageJson.version}`);

      fs.writeFile(filePath, updated, "utf8", (err) => {
        resolve();

        if (err) {
          return reject(err);
        }
      });
    });
  });
}
