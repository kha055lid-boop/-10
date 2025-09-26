// 1. إنشاء ملف backend/utils/backupManager.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const cron = require('node-cron');
const moment = require('moment-hijri');
require('dotenv').config();

class BackupManager {
  constructor() {
    this.backupDir = path.join(__dirname, '../../backups');
    this.dbConfig = {
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'namaa_db',
      host: process.env.DB_HOST || 'localhost'
    };
    
    // تكوين AWS S3 (اختياري)
    this.s3Client = process.env.AWS_ACCESS_KEY_ID ? new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    }) : null;
    
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup() {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const fileName = `backup_${timestamp}.sql`;
    const filePath = path.join(this.backupDir, fileName);
    
    const command = `mysqldump -u ${this.dbConfig.user} -p${this.dbConfig.password} ${this.dbConfig.database} > ${filePath}`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Backup failed:', error);
          return reject(error);
        }
        console.log(`Backup created successfully: ${filePath}`);
        this.uploadToS3(filePath, fileName)
          .then(() => resolve(filePath))
          .catch(err => {
            console.error('S3 upload failed, keeping local copy', err);
            resolve(filePath); // نجاح مع تحذير
          });
      });
    });
  }

  async uploadToS3(filePath, fileName) {
    if (!this.s3Client || !process.env.S3_BUCKET_NAME) {
      return Promise.resolve();
    }

    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `backups/${fileName}`,
      Body: fileContent
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      console.log(`Backup uploaded to S3: ${fileName}`);
    } catch (err) {
      console.error('Error uploading to S3:', err);
      throw err;
    }
  }

  scheduleDailyBackup() {
    // 2 صباحاً كل يوم
    cron.schedule('0 2 * * *', () => {
      console.log('Running scheduled backup...');
      this.createBackup()
        .then(() => this.cleanupOldBackups())
        .catch(console.error);
    });
  }

  cleanupOldBackups() {
    // الاحتفاظ بالنسخ الاحتياطية لآخر 7 أيام
    const maxBackupAge = 7 * 24 * 60 * 60 * 1000; // 7 أيام بالميلي ثانية
    
    fs.readdir(this.backupDir, (err, files) => {
      if (err) return console.error('Error reading backup directory:', err);
      
      files.forEach(file => {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = Date.now() - stats.mtimeMs;
        
        if (fileAge > maxBackupAge) {
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting old backup:', err);
            else console.log('Deleted old backup:', file);
          });
        }
      });
    });
  }
}

module.exports = new BackupManager();
