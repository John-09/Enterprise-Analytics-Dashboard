import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadPDF = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        console.log("Starting PDF export...");
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: true, // Enable logging to see what's happening
            backgroundColor: "#ffffff",
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        console.log("Canvas created, generating PDF...");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
        console.log("PDF saved!");
    } catch (error) {
        console.error("Failed to export PDF:", error);
    }
};
