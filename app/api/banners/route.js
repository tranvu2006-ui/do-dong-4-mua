import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const banners = await query(`
      SELECT * FROM banners
      WHERE status = 1
      ORDER BY display_order ASC, id ASC
    `);

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, image_url, link_url, display_order } = await request.json();
    if (!title || !image_url) {
      return NextResponse.json({ success: false, message: 'Thiếu tiêu đề hoặc đường dẫn ảnh banner' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO banners (title, image_url, link_url, display_order, status)
       VALUES (?, ?, ?, ?, 1)`,
      [title, image_url, link_url || '/', display_order || 0]
    );

    return NextResponse.json({ success: true, message: 'Thêm banner thành công', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, title, image_url, link_url, display_order, status } = await request.json();
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
    return NextResponse.json({ success: true, message: 'Cập nhật banner thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await query('UPDATE banners SET status = 0 WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã ẩn banner' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
