const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

async function addSampleLogs() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        // Find a CEO or Admin user to associate the logs with
        const user = await User.findOne({ role: { $in: ['ceo', 'admin'] } });

        if (!user) {
            console.error('No CEO or Admin user found in the database. Please create a user first.');
            process.exit(1);
        }

        console.log(`Adding logs for user: ${user.name} (${user.role})`);

        const sampleLogs = [
            {
                userId: user._id,
                action: 'GENERATED_REPORT',
                endpoint: '/api/analytics/generate-report',
                ipAddress: '192.168.1.45',
                details: { reportType: 'Institutional Health', status: 'Success' }
            },
            {
                userId: user._id,
                action: 'EXPORT_DATA',
                endpoint: '/api/admissions/export',
                ipAddress: '192.168.1.12',
                details: { format: 'Excel', recordCount: 156 }
            },
            {
                userId: user._id,
                action: 'VIEW_SENSITIVE',
                endpoint: '/api/analytics/health-index',
                ipAddress: '10.0.0.5',
                details: { category: 'Financial Data', accessLevel: 'Full' }
            }
        ];

        const createdLogs = await AuditLog.insertMany(sampleLogs);
        console.log(`Successfully added ${createdLogs.length} sample audit logs.`);

        process.exit(0);
    } catch (error) {
        console.error('Error adding sample logs:', error);
        process.exit(1);
    }
}

addSampleLogs();
