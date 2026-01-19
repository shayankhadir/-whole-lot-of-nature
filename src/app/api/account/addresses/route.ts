import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's saved addresses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { id: 'asc' }
          ]
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fullName, addressLine, city, state, pincode, phone, isDefault, type } = await request.json();

    // Validate required fields
    if (!fullName || !addressLine || !city || !state || !pincode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        type: type || 'shipping',
        fullName,
        addressLine,
        city,
        state,
        pincode,
        phone: phone || null,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({
      message: 'Address created successfully',
      address
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { message: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// PUT - Update an address
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, fullName, addressLine, city, state, pincode, phone, isDefault } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Address ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        addressLine,
        city,
        state,
        pincode,
        phone: phone || null,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({
      message: 'Address updated successfully',
      address
    });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { message: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an address
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Address ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { message: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
