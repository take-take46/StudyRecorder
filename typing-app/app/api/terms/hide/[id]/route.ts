import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Term } from '@/types/term';

// JSONファイルのパス
const dataFilePath = path.join(process.cwd(), 'public/data/terms.json');

// 用語の表示/非表示を切り替える
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { isHidden } = await request.json();
    
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
    
    // 表示/非表示状態を更新
    terms[index] = { ...terms[index], isHidden };
    
    // ファイルに書き込む
    await fs.writeFile(dataFilePath, JSON.stringify(terms, null, 2), 'utf8');
    
    return NextResponse.json(terms[index]);
  } catch (error) {
    console.error('Failed to update term visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update term visibility' },
      { status: 500 }
    );
  }
}