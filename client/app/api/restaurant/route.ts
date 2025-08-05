import { NextResponse } from 'next/server';
import { restaurantService } from '@/lib/services';

export async function GET() {
  try {
    const restaurantInfo = await restaurantService.getRestaurantInfo();

    if (!restaurantInfo.success) {
      return NextResponse.json(
        { error: restaurantInfo.error?.message || 'Failed to fetch restaurant info' },
        { status: 500 }
      );
    }

    return NextResponse.json(restaurantInfo.data);
  } catch (error) {
    console.error('Restaurant API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
