import path from "path"
import express from "express"
import multer from "multer"

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/")
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb) {
    // console.log("file====>", file);
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    console.log(extname, mimetype);
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb("Image only")
    }
}

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },

})
router.post("/", upload.single("image"), (req, res) => {
    // console.log("File received:", req.file); // Логируем полученный файл
    if (!req.file) {
        return res.status(400).send({ message: "File not uploaded" }); // Если файл не был загружен
    }
    // Используем path.posix для корректной обработки пути с прямыми слешами
    const filePath = path.posix.normalize(`/${req.file.path}`).replace(/\\/g, '/'); // Заменяем обратные слеши на прямые
    // console.log(" filePath = path.posix.normalize ====>", filePath);
    res.send({ message: "Image Uploaded", image: filePath }); // Отправляем путь к изображению
});
export default router;