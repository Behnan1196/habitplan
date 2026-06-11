import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BACKUP_FILE = path.join(process.cwd(), 'backups.json');
const REDIS_KEY = 'habit-backups';

async function runRedisCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!res.ok) {
      console.error(`Redis command failed: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error('Redis connection error:', error);
    return null;
  }
}

async function getBackups(): Promise<any[]> {
  const isVercelKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  if (isVercelKv) {
    const result = await runRedisCommand(['GET', REDIS_KEY]);
    if (result) {
      try {
        return JSON.parse(result);
      } catch {
        return [];
      }
    }
    return [];
  } else {
    try {
      const data = await fs.readFile(BACKUP_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

async function saveBackups(backups: any[]): Promise<boolean> {
  const isVercelKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  if (isVercelKv) {
    const result = await runRedisCommand(['SET', REDIS_KEY, JSON.stringify(backups)]);
    return result !== null;
  } else {
    try {
      await fs.writeFile(BACKUP_FILE, JSON.stringify(backups, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Failed to write local backup file:', error);
      return false;
    }
  }
}

export async function GET() {
  try {
    const backups = await getBackups();
    return NextResponse.json({ success: true, backups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.state) {
      return NextResponse.json({ success: false, error: 'State is required' }, { status: 400 });
    }

    const currentBackups = await getBackups();
    const newBackup = {
      id: `b-${Date.now()}`,
      timestamp: Date.now(),
      state: body.state,
    };

    // Keep only the last 3 backups
    const updatedBackups = [newBackup, ...currentBackups].slice(0, 3);
    const success = await saveBackups(updatedBackups);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to save backup' }, { status: 500 });
    }

    return NextResponse.json({ success: true, backups: updatedBackups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
