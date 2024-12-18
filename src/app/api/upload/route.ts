import { v2 as cloudinary } from 'cloudinary';
import {NextRequest, NextResponse} from "next/server";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '20mb',
		},
	},
};

export const POST = async (req: NextRequest) => {
	try {
		const { data } = await req.json();
		if (!data) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}
		
		const uploadedResponse = await cloudinary.uploader.upload(data, {
			public_id: data.public_id,
		});
		
		return NextResponse.json({ url: uploadedResponse.secure_url });
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ error: 'Failed to upload file' },
			{ status: 500 }
		);
	}
};
