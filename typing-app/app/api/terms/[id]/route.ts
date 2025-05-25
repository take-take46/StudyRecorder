import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Term } from '@/types/term';

// JSONファイルのパス
const dataFilePath = path.join(process.cwd(), 'public/data/terms.json');

// 特定のIDの用語を取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const terms: Term[] = JSON.parse(fileContent);
    
    const term = terms.find(term => term.id === id);
    
    if (!term) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(term);
  } catch (error) {
    console.error('Failed to fetch term:', error);
    return NextResponse.json(
      { error: 'Failed to fetch term' },
      { status: 500 }
    );
  }
}

// 用語を更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedTerm = await request.json();
    
    // ファイルから既存の用語を読み込む
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const terms: Term[] = JSON.parse(fileContent);
    
    // 指定されたIDの用語を探す
    const index = terms.findIndex(term => term.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    // 用語を更新（IDは変更しない）
    terms[index] = { ...updatedTerm, id };
    
    // ファイルに書き込む
    await fs.writeFile(dataFilePath, JSON.stringify(terms, null, 2), 'utf8');
    
    return NextResponse.json(terms[index]);
  } catch (error) {
    console.error('Failed to update term:', error);
    return NextResponse.json(
      { error: 'Failed to update term' },
      { status: 500 }
    );
  }
}

// 用語を削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // ファイルから既存の用語を読み込む
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const terms: Term[] = JSON.parse(fileContent);
    
    // 指定されたIDの用語を探す
    const index = terms.findIndex(term => term.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      );
    }
    
    // 用語を削除
    terms.splice(index, 1);
    
    // ファイルに書き込む
    await fs.writeFile(dataFilePath, JSON.stringify(terms, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete term:', error);
    return NextResponse.json(
      { error: 'Failed to delete term' },
      { status: 500 }
    );
  }
}