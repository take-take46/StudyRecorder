import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Term } from '@/types/term';

// JSONファイルのパス
const dataFilePath = path.join(process.cwd(), 'public/data/terms.json');

// 全ての用語を取得
export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const terms: Term[] = JSON.parse(fileContent);
    
    return NextResponse.json(terms);
  } catch (error) {
    console.error('Failed to read terms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch terms' },
      { status: 500 }
    );
  }
}

// 新しい用語を追加
export async function POST(request: Request) {
  try {
    const newTerm = await request.json();
    
    // ファイルから既存の用語を読み込む
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const terms: Term[] = JSON.parse(fileContent);
    
    // 新しいIDを生成（最大ID + 1）
    const maxId = terms.reduce((max, term) => Math.max(max, term.id), 0);
    newTerm.id = maxId + 1;
    
    // 新しい用語を追加
    terms.push(newTerm);
    
    // ファイルに書き込む
    await fs.writeFile(dataFilePath, JSON.stringify(terms, null, 2), 'utf8');
    
    return NextResponse.json(newTerm, { status: 201 });
  } catch (error) {
    console.error('Failed to add term:', error);
    return NextResponse.json(
      { error: 'Failed to add new term' },
      { status: 500 }
    );
  }
}