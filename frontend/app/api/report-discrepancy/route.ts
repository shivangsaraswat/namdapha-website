import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;
        const images = formData.getAll('images') as File[];

        // 1. Validate Email Domain
        const validDomains = ['ds.study.iitm.ac.in', 'es.study.iitm.ac.in'];
        const domain = email.split('@')[1];
        if (!validDomains.includes(domain)) {
            return NextResponse.json(
                { error: 'Invalid email domain. Please use your official student email (@ds.study.iitm.ac.in or @es.study.iitm.ac.in).' },
                { status: 400 }
            );
        }

        // 2. Upload Images to Cloudinary
        const imageUrls: string[] = [];
        for (const image of images) {
            if (image.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: `Image ${image.name} exceeds the 5MB limit.` },
                    { status: 400 }
                );
            }

            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'grade-predictor-reports' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as UploadApiResponse);
                    }
                );
                uploadStream.end(buffer);
            });
            imageUrls.push(result.secure_url);
        }

        // 3. Send Email
        const mailOptions = {
            from: process.env.REPORT_FROM_EMAIL,
            to: process.env.REPORT_TO_EMAIL,
            subject: `[Grade Predictor Discrepancy] Report from ${email}`,
            html: `
                <h2>Discrepancy Report</h2>
                <p><strong>Student Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
                <br/>
                <p><strong>Attached Images:</strong></p>
                <ul>
                    ${imageUrls.map(url => `<li><a href="${url}" target="_blank"><img src="${url}" alt="Attachment" style="max-width: 200px; max-height: 200px;" /></a></li>`).join('')}
                </ul>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error processing report:', error);
        return NextResponse.json(
            { error: 'Failed to submit report. Please try again later.' },
            { status: 500 }
        );
    }
}
