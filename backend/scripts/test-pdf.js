const jspdfTable = require('jspdf-autotable');
const { jsPDF } = require('jspdf');

console.log("jspdf-autotable type:", typeof jspdfTable);
console.log("jspdf-autotable keys:", Object.keys(jspdfTable));
if (jspdfTable.default) {
    console.log("jspdf-autotable.default type:", typeof jspdfTable.default);
}

try {
    const doc = new jsPDF();
    const autoTable = jspdfTable.default || jspdfTable;
    if (typeof autoTable === 'function') {
        autoTable(doc, {
            head: [['Name', 'Email']],
            body: [['John Doe', 'john@example.com']]
        });
        const buffer = Buffer.from(doc.output('arraybuffer'));
        console.log("PDF generated successfully, buffer size:", buffer.length);
    } else {
        console.error("autoTable is still not a function");
    }
} catch (error) {
    console.error("PDF Generation Error:", error);
}
