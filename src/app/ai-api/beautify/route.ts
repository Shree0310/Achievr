import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();
    // type can be: "title", "description", "comment"

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Text is required' 
      }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const prompts = {
      title: `Improve this task title. Make it clear, concise, and professional. Fix typos and grammar. Keep it under 100 characters.

Original: "${text}"

Return ONLY the improved title, nothing else.`,
      
      description: `Improve this task description. Make it clear, well-structured, and professional. Fix typos and grammar. Use proper punctuation and formatting.

Original: "${text}"

Return ONLY the improved description, nothing else.`,
      
      comment: `Improve this comment. Make it clear and professional while keeping the conversational tone. Fix typos and grammar.

Original: "${text}"

Return ONLY the improved comment, nothing else.`
    };

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: prompts[type as keyof typeof prompts] || prompts.title
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return NextResponse.json({ 
        original: text,
        improved: content.text.trim(),
        type 
      });
    }

    return NextResponse.json({ 
      error: 'Failed to generate' 
    }, { status: 500 });

  } catch (error: any) {
    console.error('Beautify error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}