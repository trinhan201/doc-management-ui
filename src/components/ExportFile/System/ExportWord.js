import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    VerticalAlign,
    WidthType,
    TableLayoutType,
    AlignmentType,
    TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

const ExportWord = (props) => {
    const dataHeader = [
        'STT',
        'Tên phòng ban',
        'Tổng số người dùng',
        'Tổng số văn bản đến',
        'Tổng số văn bản đi',
        'Tổng số công việc',
        'Tổng số tin nhắn',
    ];

    const handleExport = () => {
        let tbody;
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: 'Báo cáo thống kê hệ thống năm 2023',
                                    size: 36,
                                    bold: true,
                                    italics: true,
                                    font: 'Arial',
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: '',
                                    size: 36,
                                }),
                            ],
                        }),
                        (tbody = new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            layout: TableLayoutType.FIXED,
                            rows: [
                                new TableRow({
                                    children: dataHeader.map((title) => {
                                        return new TableCell({
                                            width: { size: 100 / dataHeader.length, type: WidthType.PERCENTAGE },
                                            shading: {
                                                fill: 'FFFD04',
                                            },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: title,
                                                            bold: true,
                                                            italics: true,
                                                            font: 'Arial',
                                                        }),
                                                    ],
                                                }),
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                        });
                                    }),
                                }),
                            ],
                        })),
                    ],
                },
            ],
        });

        props.filterData?.forEach((item, index) => {
            var tableRow = new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `${index + 1}`,
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 5, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: item.department,

                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `${item.allUsers}`,
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `${item.allDocumentIns}`,

                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: `${item.allDocumentOuts}`,
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '',
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '',
                                        font: 'Arial',
                                    }),
                                ],
                            }),
                        ],
                        verticalAlign: VerticalAlign.TOP,
                        width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                ],
            });
            tbody.root.push(tableRow);
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'report.docx');
        });
    };

    return (
        <div className="flex justify-end">
            <button
                onClick={handleExport}
                className="text-[1.3rem] w-full lg:w-fit md:text-[1.6rem] text-[white] bg-blue-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap"
            >
                Xuất tệp
            </button>
        </div>
    );
};

export default ExportWord;
