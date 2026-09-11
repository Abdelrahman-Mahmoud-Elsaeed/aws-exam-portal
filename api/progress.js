import { Redis } from '@upstash/redis';

// إنشاء اتصال مع قاعدة بيانات Redis
// سيقوم تلقائياً بقراءة UPSTASH_REDIS_REST_URL و UPSTASH_REDIS_REST_TOKEN من متغيرات البيئة
const redis = Redis.fromEnv();

export default async function handler(req, res) {
    // المفتاح الخاص بتقدمك في الامتحان
    const STORAGE_KEY = 'aws_exam_user_progress';

    // 1. عند استدعاء GET: جلب التقدم المحفوظ
    if (req.method === 'GET') {
        try {
            const data = await redis.get(STORAGE_KEY);
            return res.status(200).json(data || {});
        } catch (error) {
            console.error('Error fetching progress:', error);
            return res.status(500).json({ error: 'Failed to fetch progress' });
        }
    }

    // 2. عند استدعاء POST: تحديث وحفظ التقدم
    if (req.method === 'POST') {
        try {
            const newProgress = req.body;
            await redis.set(STORAGE_KEY, newProgress);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error saving progress:', error);
            return res.status(500).json({ error: 'Failed to save progress' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}