import multer from "multer";
import path from "path";

const allowedMimeTypes = new Set(["application/pdf"]);

const storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null , "public")
    },
    filename: function(req , file , cb){
        const safeBaseName = path
            .basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .slice(0, 80) || "resume";
        const filename = `${Date.now()}-${safeBaseName}.pdf`;
        cb(null , filename)
    }
})


export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new Error("Only PDF resumes are allowed."));
        }

        cb(null, true);
    },
});
