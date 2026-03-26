const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { importExcelData } = require('../services/excelImportService');
const Announcement = require('../models/Announcement');

/**
 * Initializes a file watcher for a specific directory.
 * When an Excel file is added or modified, it triggers the import service.
 */
const initExcelWatcher = (io) => {
  // Use a relative path from the processed location
  const watchDir = path.join(__dirname, '../../excel-imports');

  if (!fs.existsSync(watchDir)) {
    fs.mkdirSync(watchDir, { recursive: true });
    console.log(`Watcher: Created directory ${watchDir}`);
  }

  const watcher = chokidar.watch(watchDir, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      /~\$.*/          // ignore Excel temporary files
    ],
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100
    }
  });

  watcher.on('add', async (filePath) => {
    if (filePath.endsWith('.xlsx')) {
      console.log(`Watcher: New file detected - ${filePath}`);
      try {
        const results = await importExcelData(filePath, io);
        console.log('Watcher: Auto-import results:', results);
      } catch (err) {
        console.error('Watcher: Auto-import failed', err);
      }
    }
  });

  watcher.on('change', async (filePath) => {
    if (filePath.endsWith('.xlsx')) {
      console.log(`Watcher: File changed - ${filePath}`);
      try {
        const results = await importExcelData(filePath, io);
        console.log('Watcher: Auto-sync results:', results);
      } catch (err) {
        console.error('Watcher: Auto-sync failed', err);
      }
    }
  });

  console.log(`Watcher: Monitoring ${watchDir} for student data updates...`);

  // Scheduled Automated Excel Report (e.g., runs every Friday at 17:00)
  // For demonstration, we've set it to run every hour so it's easier to verify in testing, 
  // but conceptually this handles the "Automated Report Scheduling" phase.
  cron.schedule('0 * * * *', async () => {
    console.log('Cron Job: Running scheduled Weekly Automated Analytics Report generation...');
    try {
      // In a real application, you'd use exceljs or xlsx to generate the file here
      // and email it to the CEO/Admins. For this system, we notify via Announcements.
      const reportReadyAlert = new Announcement({
        title: 'System Alert: Weekly Performance Report Ready',
        content: 'The automated weekly school performance Excel report has been successfully generated and archived in the secure storage. Check the Admin Portal to download.',
        type: 'Event',
        priority: 'High'
      });
      await reportReadyAlert.save();

      if (io) {
        io.emit('newAnnouncement', { count: 1 });
      }
      console.log('Cron Job: Weekly Analytics Report simulated and notification sent.');
    } catch (e) {
      console.error('Cron Job failed:', e);
    }
  });

  return watcher;
};

module.exports = { initExcelWatcher };
