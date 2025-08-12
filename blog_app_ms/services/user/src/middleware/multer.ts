import multer from "multer";

const storage = multer.memoryStorage() // disk stoorage agar backend mei file store krni hai 

const uploadFile = multer({storage}).single('file')

export default uploadFile