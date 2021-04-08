import { diskStorage } from 'multer';
import path  from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = { 
    storage: diskStorage({
      destination: './uploads/productImages',
      filename: (req, file, cb) =>{
          const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension : string = path.parse(file.originalname).ext;
  
          cb(null, `${filename}${extension}`)
      }
   })
  
  }