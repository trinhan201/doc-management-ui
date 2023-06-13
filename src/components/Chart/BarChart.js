import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, Legend);

const BarChart = ({ typeOption, allDocuments, allDocumentIns, allDocumentOuts }) => {
    const typeValue = typeOption?.value;

    const types = [...new Set(allDocuments?.map((item) => item?.[typeValue]))];

    const countDocumentIn = () => {
        const arr = types?.map((type) => {
            return allDocumentIns?.filter((item) => item?.[typeValue] === type).length;
        });
        return arr;
    };

    const countDocumentOut = () => {
        const arr = types?.map((type) => {
            return allDocumentOuts?.filter((item) => item?.[typeValue] === type).length;
        });
        return arr;
    };

    var data = {
        labels: types,
        datasets: [
            {
                label: 'Văn bản đến',
                data: countDocumentIn(),
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
            {
                label: 'Văn bản đi',
                data: countDocumentOut(),
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    var options = {
        maintainAspectRatio: false,
        scales: {},
        plugins: {
            title: {
                display: true,
                text: 'Biểu đồ thống kê văn bản',
            },
        },
    };

    return (
        <div>
            <Bar data={data} height={400} options={options} />
        </div>
    );
};

export default BarChart;
