import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const filePath = path.join(process.cwd(), 'context', filename)
    
    const content = await fs.readFile(filePath, 'utf-8')
    
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json(
      { content: '', error: 'File not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const { content } = await request.json()
    
    const filePath = path.join(process.cwd(), 'context', filename)
    
    await fs.writeFile(filePath, content, 'utf-8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
}
