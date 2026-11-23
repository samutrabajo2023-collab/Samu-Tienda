import { execSync } from "node:child_process";

// Deja la base de datos con la tienda demo limpia antes de cada corrida.
export default function globalSetup() {
  execSync("npm run setup", { stdio: "inherit" });
}
