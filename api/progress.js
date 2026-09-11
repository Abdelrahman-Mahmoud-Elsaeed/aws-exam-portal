import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // المفتاح الخاص بتقدمك في الامتحان
    const STORAGE_KEY = 'aws_exam_user_progress';

    // 1. عند استدعاء GET: جلب التقدم المحفوظ
    if (req.method === 'GET') {
        try {
            const data = await kv.get(STORAGE_KEY);
            return res.status(200).json(data || {});
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch progress' });
        }
    }

    // 2. عند استدعاء POST: تحديث وحفظ التقدم
    if (req.method === 'POST') {
        try {
            const newProgress = req.body;
            await kv.set(STORAGE_KEY, newProgress);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to save progress' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}