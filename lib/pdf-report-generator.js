import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

/**
 * Trợ thủ kết xuất tài liệu PDF chuẩn theo SRS (API 76, FR-047, FR-050)
 * Có hỗ trợ tiếng Việt có dấu 100%, đóng dấu thời gian (Timestamp) và bảng biểu chi tiết.
 */
export async function generatePdfReport({
  title = 'BÁO CÁO TỔNG HỢP DOANH THU & ĐƠN HÀNG',
  reportType = 'revenue',
  startDate = '',
  endDate = '',
  summary = {},
  orders = [],
  settings = {}
}) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Nạp font chữ tiếng Việt Arial nhúng từ thư mục public/fonts
  const regularFontBytes = fs.readFileSync(path.join(process.cwd(), 'public/fonts/arial.ttf'));
  const boldFontBytes = fs.readFileSync(path.join(process.cwd(), 'public/fonts/arialbd.ttf'));

  const font = await pdfDoc.embedFont(regularFontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  const brandGreen = rgb(0.06, 0.42, 0.27);
  const slateDark = rgb(0.12, 0.16, 0.22);
  const slateMuted = rgb(0.42, 0.46, 0.54);
  const borderGray = rgb(0.85, 0.88, 0.92);
  const tableAltRow = rgb(0.97, 0.98, 0.99);

  const siteName = settings.site_name || 'ĐỒ ĐỒNG 4 MÙA';
  const address = settings.company_address || 'Hệ thống chi nhánh TP.HCM';
  const hotline = settings.hotline || '0901.234.567';

  // Định dạng tiền tệ
  const fmtMoney = (val) => {
    return Number(val || 0).toLocaleString('vi-VN') + ' đ';
  };

  // Ánh xạ trạng thái đơn hàng sang tiếng Việt
  const formatStatus = (st) => {
    switch (st) {
      case 'COMPLETED':
      case 'DELIVERED':
        return 'Hoàn tất';
      case 'SHIPPING':
        return 'Đang giao';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'PENDING':
      default:
        return 'Chờ xử lý';
    }
  };

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 515.28

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Header công ty
  currentPage.drawText(siteName.toUpperCase(), {
    x: margin,
    y,
    size: 13,
    font: boldFont,
    color: brandGreen
  });
  y -= 14;

  currentPage.drawText(`Trụ sở: ${address}  |  Hotline: ${hotline}`, {
    x: margin,
    y,
    size: 8.5,
    font,
    color: slateMuted
  });
  y -= 10;

  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: borderGray
  });
  y -= 25;

  // Tiêu đề báo cáo
  const titleText = title.toUpperCase();
  const titleWidth = boldFont.widthOfTextAtSize(titleText, 15);
  currentPage.drawText(titleText, {
    x: (pageWidth - titleWidth) / 2,
    y,
    size: 15,
    font: boldFont,
    color: slateDark
  });
  y -= 16;

  // Kỳ báo cáo
  let periodText = 'Kỳ báo cáo: Toàn bộ thời gian hoạt động';
  if (startDate && endDate) {
    periodText = `Kỳ báo cáo: Từ ngày ${startDate} đến ngày ${endDate}`;
  } else if (startDate) {
    periodText = `Kỳ báo cáo: Từ ngày ${startDate} đến hiện tại`;
  } else if (endDate) {
    periodText = `Kỳ báo cáo: Đến ngày ${endDate}`;
  }
  const periodWidth = font.widthOfTextAtSize(periodText, 9.5);
  currentPage.drawText(periodText, {
    x: (pageWidth - periodWidth) / 2,
    y,
    size: 9.5,
    font,
    color: slateDark
  });
  y -= 14;

  // Dấu thời gian (Timestamp) theo yêu cầu SRS
  const now = new Date();
  const timestampText = `Đóng dấu thời gian xuất (Timestamp): ${now.toLocaleTimeString('vi-VN')} ngày ${now.toLocaleDateString('vi-VN')}`;
  const tsWidth = font.widthOfTextAtSize(timestampText, 8.5);
  currentPage.drawText(timestampText, {
    x: (pageWidth - tsWidth) / 2,
    y,
    size: 8.5,
    font,
    color: slateMuted
  });
  y -= 25;

  // Khối tóm tắt KPI (Summary Box)
  const boxHeight = 50;
  currentPage.drawRectangle({
    x: margin,
    y: y - boxHeight,
    width: contentWidth,
    height: boxHeight,
    color: rgb(0.97, 0.99, 0.98),
    borderColor: rgb(0.72, 0.88, 0.8),
    borderWidth: 1
  });

  const colW = contentWidth / 4;
  const kpiItems = [
    { label: 'TỔNG DOANH THU', value: fmtMoney(summary.totalRevenue || 0), color: brandGreen },
    { label: 'TỔNG ĐƠN HÀNG', value: `${summary.totalOrders || orders.length} đơn`, color: slateDark },
    { label: 'ĐƠN HOÀN TẤT', value: `${summary.completedOrders || 0} đơn`, color: brandGreen },
    { label: 'DOANH THU TB/ĐƠN', value: fmtMoney(summary.averageOrderValue || 0), color: slateDark }
  ];

  kpiItems.forEach((kpi, idx) => {
    const kpiX = margin + idx * colW + 10;
    currentPage.drawText(kpi.label, {
      x: kpiX,
      y: y - 18,
      size: 7.5,
      font: boldFont,
      color: slateMuted
    });
    currentPage.drawText(kpi.value, {
      x: kpiX,
      y: y - 36,
      size: 11,
      font: boldFont,
      color: kpi.color
    });
    if (idx < 3) {
      currentPage.drawLine({
        start: { x: margin + (idx + 1) * colW, y: y - 8 },
        end: { x: margin + (idx + 1) * colW, y: y - boxHeight + 8 },
        thickness: 0.5,
        color: borderGray
      });
    }
  });

  y -= boxHeight + 20;

  // Bảng dữ liệu đơn hàng chi tiết
  const tableCols = [
    { label: 'STT', width: 28, align: 'center' },
    { label: 'MÃ ĐƠN', width: 75, align: 'left' },
    { label: 'NGÀY ĐẶT', width: 75, align: 'left' },
    { label: 'NGƯỜI NHẬN', width: 105, align: 'left' },
    { label: 'ĐIỆN THOẠI', width: 75, align: 'left' },
    { label: 'TRẠNG THÁI', width: 70, align: 'center' },
    { label: 'TỔNG TIỀN', width: 87.28, align: 'right' }
  ];

  const drawTableHeader = (pg, curY) => {
    pg.drawRectangle({
      x: margin,
      y: curY - 20,
      width: contentWidth,
      height: 20,
      color: brandGreen
    });

    let x = margin;
    tableCols.forEach(col => {
      let textX = x + 4;
      if (col.align === 'center') {
        const tw = boldFont.widthOfTextAtSize(col.label, 8);
        textX = x + (col.width - tw) / 2;
      } else if (col.align === 'right') {
        const tw = boldFont.widthOfTextAtSize(col.label, 8);
        textX = x + col.width - tw - 4;
      }
      pg.drawText(col.label, {
        x: textX,
        y: curY - 14,
        size: 8,
        font: boldFont,
        color: rgb(1, 1, 1)
      });
      x += col.width;
    });
  };

  drawTableHeader(currentPage, y);
  y -= 20;

  const rowHeight = 18;
  const minBottomY = 120; // Để chừa chỗ cho chữ ký ở trang cuối

  orders.forEach((ord, index) => {
    // Nếu sắp chạm đáy trang -> ngắt trang mới
    if (y - rowHeight < minBottomY) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;

      // Header trang phụ
      currentPage.drawText(`${siteName}  |  ${title}`, {
        x: margin,
        y,
        size: 8,
        font: boldFont,
        color: slateMuted
      });
      y -= 14;

      drawTableHeader(currentPage, y);
      y -= 20;
    }

    // Vẽ hàng nền xen kẽ
    if (index % 2 === 1) {
      currentPage.drawRectangle({
        x: margin,
        y: y - rowHeight,
        width: contentWidth,
        height: rowHeight,
        color: tableAltRow
      });
    }

    currentPage.drawLine({
      start: { x: margin, y: y - rowHeight },
      end: { x: pageWidth - margin, y: y - rowHeight },
      thickness: 0.5,
      color: borderGray
    });

    // Vẽ dữ liệu từng cột
    const dateStr = ord.created_at ? new Date(ord.created_at).toLocaleDateString('vi-VN') : '';
    const stt = String(index + 1);
    const code = ord.order_code || `DH-${ord.id}`;
    const name = ord.receiver_name ? (ord.receiver_name.length > 18 ? ord.receiver_name.slice(0, 16) + '..' : ord.receiver_name) : 'Khách lẻ';
    const phone = ord.phone || '';
    const statusText = formatStatus(ord.order_status);
    const amountText = fmtMoney(ord.total_amount);

    const values = [
      { text: stt, ...tableCols[0] },
      { text: code, ...tableCols[1] },
      { text: dateStr, ...tableCols[2] },
      { text: name, ...tableCols[3] },
      { text: phone, ...tableCols[4] },
      { text: statusText, ...tableCols[5] },
      { text: amountText, ...tableCols[6] }
    ];

    let x = margin;
    values.forEach(v => {
      let textX = x + 4;
      if (v.align === 'center') {
        const tw = font.widthOfTextAtSize(v.text, 8);
        textX = x + (v.width - tw) / 2;
      } else if (v.align === 'right') {
        const tw = font.widthOfTextAtSize(v.text, 8);
        textX = x + v.width - tw - 4;
      }
      currentPage.drawText(v.text, {
        x: textX,
        y: y - 13,
        size: 8,
        font,
        color: slateDark
      });
      x += v.width;
    });

    y -= rowHeight;
  });

  // Khối chữ ký phê duyệt ở cuối báo cáo
  y -= 30;
  if (y < 90) {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin - 30;
  }

  const sigColW = contentWidth / 2;
  currentPage.drawText('NGƯỜI LẬP BÁO CÁO', {
    x: margin + 30,
    y,
    size: 9.5,
    font: boldFont,
    color: slateDark
  });
  currentPage.drawText('(Ký và ghi rõ họ tên)', {
    x: margin + 35,
    y: y - 12,
    size: 8,
    font,
    color: slateMuted
  });

  currentPage.drawText('ĐẠI DIỆN QUẢN TRỊ VIÊN HỆ THỐNG', {
    x: margin + sigColW + 20,
    y,
    size: 9.5,
    font: boldFont,
    color: slateDark
  });
  currentPage.drawText('(Ký, đóng dấu phê duyệt)', {
    x: margin + sigColW + 45,
    y: y - 12,
    size: 8,
    font,
    color: slateMuted
  });

  // Đánh số trang toàn bộ tài liệu ở góc dưới
  const totalPages = pdfDoc.getPageCount();
  pdfDoc.getPages().forEach((page, idx) => {
    const pageNumText = `Trang ${idx + 1} / ${totalPages}  |  Tài liệu bảo mật lưu trữ nội bộ ${siteName}`;
    const ptw = font.widthOfTextAtSize(pageNumText, 7.5);
    page.drawText(pageNumText, {
      x: (pageWidth - ptw) / 2,
      y: 20,
      size: 7.5,
      font,
      color: slateMuted
    });
  });

  return await pdfDoc.save();
}
