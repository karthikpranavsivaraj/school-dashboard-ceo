const mongoose = require('mongoose');
require('dotenv').config();

const testEndpoints = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to DB');
        
        // Emulate express requests by using the models directly, similar to what analytics.js does
        const Admission = require('./models/Admission');
        const Grade = require('./models/Grade');
        const Staff = require('./models/Staff');
        const Query = require('./models/Query');

        console.log('\n--- Testing /classes-performance ---');
        const students = await Admission.find({ status: 'Approved' });
        const grades = await Grade.find();
        
        const classesMap = {};
        students.forEach(s => {
          if (!s.grade) return;
          const key = s.grade;
          if (!classesMap[key]) classesMap[key] = { id: key, name: key, sections: new Set(), totalStudents: 0, scores: [] };
          classesMap[key].sections.add(s.section || 'A');
          classesMap[key].totalStudents++;
        });
        grades.forEach(g => {
          if (classesMap[g.class]) classesMap[g.class].scores.push(g.score);
        });
        const resultClasses = Object.values(classesMap).map(c => {
          const avg = c.scores.length > 0 ? c.scores.reduce((a, b) => a + b) / c.scores.length : 0;
          return { name: c.name, totalStudents: c.totalStudents, averagePerformance: Math.round(avg) };
        }).sort((a, b) => a.name.localeCompare(b.name));
        console.log('Result:', resultClasses);

        console.log('\n--- Testing /staff-burnout ---');
        const staff = await Staff.find({ status: 'Active' });
        const resultStaff = staff.map(s => {
          let riskScore = 40 + (Math.random() * 10);
          if (s.experience < 2) riskScore += 25;
          else if (s.experience > 10) riskScore -= 15;
          return { name: s.name, department: s.department, riskScore: Math.min(Math.round(riskScore), 100) };
        }).slice(0, 3);
        console.log('Result (Top 3):', resultStaff);

        console.log('\n--- Testing /branches-health ---');
        const totalAdmissions = await Admission.countDocuments({ status: 'Approved' });
        const activeStaff = await Staff.countDocuments({ status: 'Active' });
        const resolvedQueries = await Query.countDocuments({ status: 'Resolved' });
        const totalQueries = await Query.countDocuments();
        const satisfaction = totalQueries > 0 ? Math.round((resolvedQueries / totalQueries) * 100) : 100;
        const resultBranches = [
          { name: 'Main Campus', healthScore: Math.min(Math.round((satisfaction + 85) / 2), 100), students: totalAdmissions, staff: activeStaff }
        ];
        console.log('Result:', resultBranches);

    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await mongoose.connection.close();
        console.log('\nDone.');
    }
}

testEndpoints();
