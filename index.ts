import fs from "fs";
import path from "path";

const csvPath = path.resolve(__dirname, "csv-file.csv");
const jsonPath = path.resolve(__dirname, "json-generated.json");

const JSON_REPLACER = null;
const JSON_IDENTITY_SPACES = 4;

const JSONrows = [];

const typeMap = {

    "New": "N",
    "Improvement": "I",
    "Fixes": "F",
}

function transformTypeFieldToDatabaseChar(csvType: string) {

    if (csvType in typeMap) return typeMap[csvType as keyof typeof typeMap];

    return "F";
}

function formatDate(stringifyDate: string) {

    const digits = stringifyDate.split("/");

    const yyyy = digits[2];

    const mm = parseInt(digits[0]) <= 9 
        ? "0" + digits[0]
        : digits[0]

    const dd = parseInt(digits[1]) <= 9 
        ? "0" + digits[1]
        : digits[1]

    return `${yyyy}-${mm}-${dd}`;
}

function createTranslateObject(text: string) {

    return {

        "en-US": text,
        "pt-BR": text,
        "es": text
    }
}

(async () => {


    const buffer = fs.readFileSync(csvPath);
    const stringify = buffer.toString();

    const lines = stringify.split("\n");

    for (const line of lines) {

        if (line === "\r" || line === "\n" || line === "") continue;

        const withoutCarryingReturns = line 
            .replace("\n", "")
            .replace("\r", "");

        const [version, type, title, description, date] = withoutCarryingReturns.split("|");

        console.log({
            version, type, title, description, date
        })

        JSONrows.push({

            version, 
            type: transformTypeFieldToDatabaseChar(type),
            title: createTranslateObject(title),
            description: createTranslateObject(description),
            date: formatDate(date)
        });
    }

    if (fs.existsSync(jsonPath)) fs.rmSync(jsonPath);

    fs.writeFileSync(jsonPath, JSON.stringify(JSONrows, JSON_REPLACER, JSON_IDENTITY_SPACES));

})();
