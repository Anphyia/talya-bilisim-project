import { NextResponse } from 'next/server';
import { menuGroupsService } from '@/lib/services';

export async function GET() {
  try {
    const menuGroups = await menuGroupsService.getProcessedMenuGroups();

    if (!menuGroups.success) {
      return NextResponse.json(
        { error: menuGroups.error?.message || 'Failed to fetch menu groups' },
        { status: 500 }
      );
    }

    return NextResponse.json(menuGroups.data);
  } catch (error) {
    console.error('Menu groups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
