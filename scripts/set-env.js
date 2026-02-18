const fs = require("fs");
const path = require("path");

const targetPath = path.join(__dirname, "../src/environments/environment.ts");
const targetPathDev = path.join(
  __dirname,
  "../src/environments/environment.development.ts",
);

// Default to the production URL provided by the user if no env var is set
const apiUrl =
  (
    process.env.BACKEND_URL || "https://campusease-backend.onrender.com"
  ).replace(/\/$/, "") + "/";
const faceApiUrl =
  (process.env.FACE_API_URL || "http://localhost:5000").replace(/\/$/, "") +
  "/";

const envFileContent = `export const environment = {
  api_url: '${apiUrl}',
  face_api_url: '${faceApiUrl}'
};
`;

console.log("Generating environment files...");

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

ensureDirectoryExistence(targetPath);

try {
  fs.writeFileSync(targetPath, envFileContent);
  console.log(`Generated environment.ts with api_url: ${apiUrl}`);
} catch (err) {
  console.error("Error writing environment.ts:", err);
}

try {
  fs.writeFileSync(targetPathDev, envFileContent);
  console.log(`Generated environment.development.ts with api_url: ${apiUrl}`);
} catch (err) {
  console.error("Error writing environment.development.ts:", err);
}
