'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

export default function DownloadReport() {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const el = document.getElementById('dashboard-content');
            if (!el) return;

            const canvas = await html2canvas(el, {
                backgroundColor: '#0a0e1a',
                scale: 1.5,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 1.5, canvas.height / 1.5] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 1.5, canvas.height / 1.5);
            pdf.save(`airwatch-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
            style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60a5fa',
            }}
        >
            <Download className="w-4 h-4" />
            {loading ? 'Generating PDF…' : 'Download Report'}
        </button>
    );
}
