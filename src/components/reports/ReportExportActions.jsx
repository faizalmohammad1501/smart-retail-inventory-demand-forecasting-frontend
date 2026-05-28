import { Download, FileText, Printer } from 'lucide-react'

const ReportExportActions = ({ onExportCsv, onExportSummary, onSavePdf, reportLabel }) => {
  return (
    <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between print-page-break no-print">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Analytics Export</h2>
        <p className="text-sm text-gray-500">Download filtered transaction history, summary metrics, or export a print-ready report.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onExportCsv('Transactions', reportLabel)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Download size={18} /> Transaction CSV
        </button>
        <button
          type="button"
          onClick={onExportSummary}
          className="btn-secondary inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900"
        >
          <FileText size={18} /> Summary CSV
        </button>
        <button
          type="button"
          onClick={onSavePdf}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Printer size={18} /> Save as PDF
        </button>
      </div>
    </div>
  )
}

export default ReportExportActions
