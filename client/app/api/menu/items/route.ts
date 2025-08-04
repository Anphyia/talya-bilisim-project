import { NextResponse } from 'next/server';
import { menuItemsService } from '@/lib/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (groupId) {
      // Get items for specific group
      const menuItems = await menuItemsService.getMenuItemsByGroup(parseInt(groupId));
      
      if (!menuItems.success) {
        return NextResponse.json(
          { error: menuItems.error?.message || 'Failed to fetch menu items' },
          { status: 500 }
        );
      }

      return NextResponse.json(menuItems.data);
    } else {
      // Get all menu items
      const menuItems = await menuItemsService.getProcessedMenuItems();
      
      if (!menuItems.success) {
        return NextResponse.json(
          { error: menuItems.error?.message || 'Failed to fetch menu items' },
          { status: 500 }
        );
      }

      return NextResponse.json(menuItems.data);
    }
  } catch (error) {
    console.error('Menu items API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
