import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: String,
    filePath: String
});

const File = mongoose.model('File', fileSchema);
async function uploadFile() {
    try {
        if (!req.file) {
            return 'No file uploaded';
        }
        const file = new File({
            name: req.file.originalname,
            filePath: req.file.path
        });
        await file.save();
        return file;
      } catch (err) {
        return err;
    }
};

async function getFile() {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return 'file not found';
        }
        else {
            return file;
        }
    }
    catch (err) {
        return err;
    }
}

export {uploadFile, getFile}