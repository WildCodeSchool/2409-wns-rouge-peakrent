import fs from "fs";
import path from "path";

const rootFolders = [
  "./src/components/buttons",
  "./src/components/cards",
  "./src/utils",
  "./src/hooks",
  "./src/types",
  "./src/components/forms/formField",
  "./src/components/ui/tables/columns",
  "./src/schemas/utils",
  "./src/graphQL",
  "./src/components/ui"
  // others folders
]

const ignoredFolders = [
  "./src/components/forms/formField/select/options",
  "./src/components/forms/formField/combobox/search",
  "./src/components/ui/tables/columns/components",
  "./src/components/ui/tables/columns/utils",
]

const removeComments = (code) => {
  return code
    // Remove /* block comments */
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove // line comments
    .replace(/\/\/.*/g, "")
}

// filter exportable files (not index, not test, only .ts or .tsx)
const isExportableFile = (file) => {
  const ext = path.extname(file)
  const isIndex = file === "index.ts"
  const isTS = [".ts", ".tsx"].includes(ext)
  const isTest = file.includes(".test") || file.includes(".spec") || file.includes(".d.ts") || file.includes("supabase.ts")
  return isTS && !isIndex && !isTest
}

// get all valid files recursively
const getExportableFiles = (dir, rootDir) => {
  let result = []
  const entries = fs.readdirSync(dir)

  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (ignoredFolders.some(folder => fullPath.includes(folder))) {
        continue;
      }
      result = result.concat(getExportableFiles(fullPath, rootDir))
    } else if (stat.isFile() && isExportableFile(entry)) {
      const rawContent = fs.readFileSync(fullPath, "utf8")
      const content = removeComments(rawContent)

      // check if the file contains an export (line or multiline)
      const isModule = /export\s+(const|function|class|type|interface|enum|default|\{)/.test(content)

      if (isModule) {
        const relative = "./" + path.relative(rootDir, fullPath).replace(/\\/g, "/").replace(/\.[tj]sx?$/, "")
        result.push(`export * from "${relative}";`)
      }
    }
  }

  return result
}

const generateRootBarrel = (folderPath) => {
  const exports = getExportableFiles(folderPath, folderPath)

  if (exports.length > 0) {
    const indexPath = path.join(folderPath, "index.ts")
    fs.writeFileSync(indexPath, exports.join("\n") + "\n", "utf8")
    console.log(`✅ index.ts generated : ${folderPath}`)
  } else {
    console.log(`ℹ️ No exportable files in : ${folderPath}`)
  }
}

// Execution
rootFolders.forEach((folder) => {
  if (fs.existsSync(folder)) {
    generateRootBarrel(folder)
  } else {
    console.warn(`⚠️ Folder not found : ${folder}`)
  }
})
