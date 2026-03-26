/**
 * Tactical Insights Utility for Backend
 * Replicated from frontend for executive reporting.
 */

function getTacticalInsights(data) {
    const insights = [];

    if (data.attendanceRiskCount > 5) {
        insights.push({
            type: 'Risk',
            message: `${data.attendanceRiskCount} students identified as high-priority attendance risks. Intervention required.`,
            priority: 'High'
        });
    }

    if (data.enrollmentGrowth > 10) {
        insights.push({
            type: 'Growth',
            message: `Enrollment velocity is outperforming targets by ${data.enrollmentGrowth}%. Capacity planning recommended.`,
            priority: 'Medium'
        });
    }

    if (data.pendingQueries > 20) {
        insights.push({
            type: 'Operational',
            message: `Parent query backlog growing. Consider reallocating staff to support channels.`,
            priority: 'Medium'
        });
    }

    // Fallback if no specific risks
    if (insights.length === 0) {
        insights.push({
            type: 'Operational',
            message: 'All institutional systems operating within optimal parameters.',
            priority: 'Low'
        });
    }

    return insights;
}

module.exports = { getTacticalInsights };
