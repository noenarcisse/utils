#!/usr/bin/env node

const fastFolderSize = require('fast-folder-size');
const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();


const files = fs.readdirSync(currentDir, { withFileTypes: true });
const folders = files.filter(f => f.isDirectory());

const dirSizes = [];

folders.forEach(f => {
    fastFolderSize(path.join(currentDir, f.name), (err, bytes) => {

        dirSizes.push({ name: f.name, size: bytes || 0 });

        if (dirSizes.length === folders.length) {
            dirSizes.sort((a, b) => b.size - a.size);

            for (dir of dirSizes) {
                console.log(`${dir.name} > ${(dir.size / 1024 / 1024).toFixed(2)} Mo`);
            }

        }
    });
});