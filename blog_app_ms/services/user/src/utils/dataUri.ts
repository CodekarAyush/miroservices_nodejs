import DataURIParser from "datauri/parser";
import path from "path";

const getBuffer = (file: any) => {
    if (!file) throw new Error("File not provided to getBuffer");

    const parser = new DataURIParser();
    const extensionName = path.extname(file.originalname).toString();

    return parser.format(extensionName, file.buffer);
};

export default getBuffer;
