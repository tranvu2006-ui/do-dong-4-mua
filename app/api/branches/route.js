import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const branches = await query(`
      SELECT * FROM branches
      WHERE status = 1
      ORDER BY id ASC
    `);

    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { branch_name, phone, address } = await request.json();
    if (!branch_name || !phone || !address) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đủ tên, SĐT và địa chỉ chi nhánh' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO branches (branch_name, phone, address, status) VALUES (?, ?, ?, 1)`,
      [branch_name, phone, address]
    );

    return NextResponse.json({ success: true, message: 'Thêm chi nhánh thành công', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, branch_name, phone, address, status } = await request.json();
    await query(
      `UPDATE branches SET branch_name = ?, phone = ?, address = ?, status = COALESCE(?, status) WHERE id = ?`,
      [branch_name, phone, address, status, id]
    );
    return NextResponse.json({ success: true, message: 'Cập nhật chi nhánh thành công' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await query('UPDATE branches SET status = 0 WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã tạm ngưng chi nhánh' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
