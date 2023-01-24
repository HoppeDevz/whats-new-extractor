import fs from "fs";
import path from "path";

const jsonPath = path.resolve(__dirname, "json-generated.json");

const RELEASE_ID = 16;
const BUILD = "2f72g2c";

type TranslateObject = {

    "en-US": string
    "pt-BR": string
    "es": string
}

type Row = {

    version: string
    type: string
    title: TranslateObject
    description: TranslateObject
    date: string
}

(async () => {

    const buffer = fs.readFileSync(jsonPath);
    const parsed = JSON.parse(buffer.toString()) as Row[];

    let query = "";

    for (const row of parsed) {

        query += `


INSERT INTO 
    ciq.release ("title", "description", "type", "date", "releaseId", "build") 
VALUES 
    ('${JSON.stringify(row.title)}', '${JSON.stringify(row.description)}', '${row.type}', '${row.date}', ${RELEASE_ID}, '${BUILD}');


        `
    }

    if (fs.existsSync("sql-generated.sql")) fs.unlinkSync("sql-generated.sql");

    fs.writeFileSync("sql-generated.sql", query);

})();

// "version": "CIQ V1.1.1",
// "type": "N",
// "title": {
//     "en-US": "Employees",
//     "pt-BR": "Funcionários",
//     "es": "Empleados"
// },
// "description": {
//     "en-US": "A section for adding, editing and delete employees was added to Administrative Settings.",
//     "pt-BR": "Uma seção para adicionar, editar e excluir funcionários foi adicionada às Configurações Administrativas.",
//     "es": "Se agregó una sección para agregar, editar y eliminar empleados en Configuración administrativa."
// },
// "date": "2023-19-01"
