'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/services/api';

export default function ReportPage() {
  const [data, setData] = useState({ list: [], chart: [] });

  useEffect(() => {
    api.get('/posts/report-data').then(res => setData(res.data));
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Posts (Último Ano)", 14, 15);
    
    autoTable(doc, {
      head: [['Título', 'Data']],
      body: data.list.map(p => [p.title, new Date(p.created_at).toLocaleDateString()]),
    });
    
    doc.save('relatorio_posts.pdf');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Relatório Gerencial</h1>
      
      <div className="h-64 mb-8 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button 
        onClick={generatePDF}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Baixar PDF
      </button>
    </div>
  );
}