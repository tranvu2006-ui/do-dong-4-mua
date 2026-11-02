import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const branches = await query('SELECT * FROM branches WHERE id = ?', [id]);
    if (branches.length === 0) {
      return NextResponse.json({ success: false, message: 'Chi nhánh không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: branches[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { branch_name, phone, address, status } = await request.json();

    await query(
      `UPDATE branches 
       SET branch_name = COALESCE(?, branch_name),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [branch_name, phone, address, status, id]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật thông tin chi nhánh thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM branches WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Xóa chi nhánh thành công!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

