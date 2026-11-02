import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM banners WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Banner không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, image_url, link_url, display_order, status } = await request.json();

    await query(
      `UPDATE banners 
       SET title = COALESCE(?, title),
           image_url = COALESCE(?, image_url),
           link_url = COALESCE(?, link_url),
           display_order = COALESCE(?, display_order),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title, image_url, link_url, display_order, status, id]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật Banner thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM banners WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Xóa Banner thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

